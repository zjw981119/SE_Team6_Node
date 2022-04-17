/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/bookmarks/BookmarkControllerI";
import BookmarkDao from "../daos/BookmarkDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/bookmarks to retrieve all the tuits bookmarked by a user </li>
 *     <li>POST /users/:uid/bookmarks/:tid to record that a user bookmarks a tuit </li>
 *     <li>DELETE /users/:uid/bookmarks/:tid to record that a user
 *     no londer bookmarks a tuit</li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
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


            app.post("/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userUnbookmarksTuit);
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
            .then(bookmarks => res.json(bookmarks));
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
        const bookmarkTuitsBasedOnTags = bookmarkedTuits.map((tuit) => {
            if(tuit.bookmarkedTuit.tag == req.params.tag)
                return {
                    tuit: tuit.bookmarkedTuit,
                }
        })
        return res.json(bookmarkTuitsBasedOnTags)
    }


        // const bookmarkedTuits = await BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid);
        // const bookmarkTuitsBasedOnTags = bookmarkedTuits.map((tuit) => {
        //     if(tuit.bookmarkedTuit.tag == req.params.tag)
        //         return {
        //             tuit: tuit.bookmarkedTuit,
        //         }
        // })
        // return res.json(bookmarkTuitsBasedOnTags)
    // }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark that was inserted in the
     * database
     */
    userBookmarksTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        BookmarkController.bookmarkDao.userBookmarksTuit(userId, req.params.tid)
            .then(async bookmarks => {
                // // filter out likes with null tuit
                // const nonBookamrk = bookmarks.filter(bookmarks => bookmarks.tuit);
                // // extract tuit objects and assign them to elements in the new array
                // const bookmarked = nonBookamrk.map(bookmarks => bookmarks.tuit);
                // //update isLiked/isDisliked properties
                // await this.addProperty(bookmarked, userId)
                res.json(bookmarks);
            });
        //
        //
        // BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
        //     .then(bookmarks => res.json(bookmarks));
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuit being unbookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        BookmarkController.bookmarkDao.userUnbookmarksTuit(userId, req.params.tid)
            .then(status => res.send(status));
    }
};