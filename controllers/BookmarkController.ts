/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/bookmarks/BookmarkControllerI";
import BookmarkDao from "../daos/BookmarkDao";
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/bookmarks to retrieve all the tuits bookmarked by a user </li>
 *     <li>GET /users/:uid/bookmarks/:tags to retrieve all the tuits with a particular tag bookmarked by a user </li>
 *     <li>GET /users/:uid/tags to retrieve all the unique tags bookmarked by a user </li>
 *     <li>PUT /users/:uid/bookmarks/:tid to record that a user toggles bookmarks in a tuit </li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @return bookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get("/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);

            //check
            app.get("/users/:uid/bookmarks/:tag", BookmarkController.bookmarkController.findTuitsBookmarkedBasedOnTags);
            app.get("/users/:uid/tags", BookmarkController.bookmarkController.findAllTags)

            app.put("/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userTogglesTuitBookmarks);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits that bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuits objects
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(userId)
            .then(async bookmarks => {
                // filter out null tuits
                const bookmarkedNonNullTuits = bookmarks.filter(bookmark => bookmark.bookmarkedTuit);
                // extract tuit objects and assign them to elements in the new array
                const tuitsFromBookmarks = bookmarkedNonNullTuits.map(bookmark => bookmark.bookmarkedTuit);
                //update isLiked/isDisliked/isBookmarked properties
                await this.addProperty(tuitsFromBookmarks, userId)
                res.json(tuitsFromBookmarks);
            });
    }

    /**
     * Retrieves all tuits that bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuits objects filtered based on tags.
     */
    findTuitsBookmarkedBasedOnTags = async(req: Request, res: Response) =>{
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        const bookmarkedTuits = await BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(userId);
        // filter out null tuits && tag
        const bookmarkedNonNullTuits = bookmarkedTuits.filter(bookmark =>
            bookmark.bookmarkedTuit && bookmark.bookmarkedTuit.tag == req.params.tag
        );
        // extract tuit object from bookmark object
        const bookmarkTuitsBasedOnTags = bookmarkedNonNullTuits.map(tuit => tuit.bookmarkedTuit)
        //update isLiked/isDisliked/isBookmarked properties
        await this.addProperty(bookmarkTuitsBasedOnTags, userId)
        return res.json(bookmarkTuitsBasedOnTags)
    }

    /**
     * Retrieves all unique tags that bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the unique tags.
     */
    findAllTags = async(req: Request, res: Response) =>{
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        const bookmarkedTuits = await BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(userId);
        // filter out null tuits && tag
        const bookmarkedNonNullTuits = bookmarkedTuits.filter(bookmark =>
            bookmark.bookmarkedTuit
        );
        // extract tag object from bookmark object
        const bookmarkedTags = bookmarkedNonNullTuits.map(tuit => tuit.bookmarkedTuit.tag)
        // Select only the unique elements from tags
        const setOfBookmarkedTags = new Set(bookmarkedTags)
        // convert set to array
        const uniqueValues = [...setOfBookmarkedTags]
        return res.json(uniqueValues)
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark that was inserted in the
     * database
     */
    userTogglesTuitBookmarks = async (req: Request, res: Response) => {
        const tuitDao = BookmarkController.tuitDao;
        const bookmarkDao = BookmarkController.bookmarkDao;
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        const tid = req.params.tid;
        // avoid server crash
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        try {
            // check if user already has bookmarked tuit
            const userAlreadyBookmarkedTuit = await bookmarkDao.findUserBookmarksTuit(userId, tid);
            const bookmarkNumber = await bookmarkDao.countHowManyBookmarkedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            // unbookmark tuit
            if (userAlreadyBookmarkedTuit) {
                await bookmarkDao.userUnbookmarksTuit(userId, tid);
                tuit.stats.bookmarks = bookmarkNumber - 1;
            } else {
                // user bookmarks a tuit
                await bookmarkDao.userBookmarksTuit(userId, tid);
                tuit.stats.bookmarks = bookmarkNumber + 1;
            }
            // update tuit stats
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    private async addProperty(tuits: Tuit[], userId: string) {
        for (let i = 0; i < tuits.length; i++) {
            const userAlreadyLikedTuit = await BookmarkController.likeDao.findUserLikesTuit(userId, tuits[i]._id);
            const userAlreadyDislikedTuit = await BookmarkController.dislikeDao.findUserDislikesTuit(userId, tuits[i]._id)
            const userAlreadyBookmarkedTuit = await BookmarkController.bookmarkDao.findUserBookmarksTuit(userId, tuits[i]._id)
            //add isliked/isDisliked/isBookmarked property
            tuits[i].isLiked = Boolean(userAlreadyLikedTuit);
            tuits[i].isDisliked = Boolean(userAlreadyDislikedTuit)
            tuits[i].isBookmarked = Boolean(userAlreadyBookmarkedTuit)
        }
    }

};