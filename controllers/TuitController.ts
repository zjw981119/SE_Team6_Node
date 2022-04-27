/**
 * @file Controller RESTful Web service API for tuits resource
 */
import {Express, Request, Response} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/tuits/TuitControllerI";
import LikeDao from "../daos/LikeDao";
import Tuit from "../models/tuits/Tuit";
import DislikeDao from "../daos/DislikeDao";
import BookmarkDao from "../daos/BookmarkDao";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /tuits to retrieve all the tuit instances</li>
 *     <li>GET /tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>POST /users/:uid/tuits to create a new tuit instance for a given user</li>
 *     <li>PUT /tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {
    private tuitDao: TuitDao = TuitDao.getInstance();
    private likeDao: LikeDao = LikeDao.getInstance();
    private bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitController: TuitController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @return tuitController
     */
    public static getInstance = (app: Express): TuitController => {
        if(TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            //define HTTP request address
            app.get("/tuits", TuitController.tuitController.findAllTuits);
            app.get("/tuits/:tid", TuitController.tuitController.findTuitById);
            app.get("/users/:uid/tuits", TuitController.tuitController.findTuitsByUser);
            app.post("/users/:uid/tuits", TuitController.tuitController.createTuitByUser);
            app.put("/tuits/:tid", TuitController.tuitController.updateTuit);
            app.delete("/tuits/:tid", TuitController.tuitController.deleteTuit);

            //for testing, not RESTful
            app.delete("/tuits/content/:content/delete", TuitController.tuitController.deleteTuitByContent);
        }
        return TuitController.tuitController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuits = async (req: Request, res: Response) => {
        let tuits: Tuit[] = await this.tuitDao.findAllTuits()
        // @ts-ignore
        // user already login
        if (req.session['profile']) {
            // @ts-ignore
            let userId = req.session['profile']._id;
            //update isLiked/isDisliked/isBookmarked property
            await this.addProperty(tuits, userId);
        }
        res.json(tuits);
    }

    /**
     * Retrieves all tuits from the database for a particular user and returns
     * an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findTuitsByUser = async (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "my" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        // avoid server crash
        if (userId === "my") {
            res.sendStatus(503);
            return;
        }
        let tuits: Tuit[] = await this.tuitDao.findTuitsByUser(userId)
        //update isLiked/isDisliked/isBookmarked property
        await this.addProperty(tuits, userId);
        return res.json(tuits);
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the tid
     */
    findTuitById = (req: Request, res: Response) =>
        this.tuitDao.findTuitById(req.params.tid)
            .then(tuit => res.json(tuit));


    /**
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuitByUser = (req: Request, res: Response) => {

        // retrieve _id from session or parameter's uid
        // @ts-ignore
        let userId = req.params.uid === "my" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        // avoid server crash
        if (userId === "my") {
            res.sendStatus(503);
            return;
        }
        let tuit = req.body;
        // a tag must start with #, following at least one (letter/number/_)
        const reg = /#\w+/
        const result = reg.exec(tuit.tuit);
        // result[0] is the matched string
        if(result){
            // remove # from result[0]
            tuit.tag = result[0].substring(1);
        }
        this.tuitDao.createTuitByUser(userId, tuit)
            .then(tuit => res.json(tuit));
    }


    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTuit = (req: Request, res: Response) =>
        this.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status));


    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuit = (req: Request, res: Response) => {
        const tid = req.params.tid;
        const deleteTuit = this.tuitDao.deleteTuit(tid);
        const deleteLikes = this.likeDao.deleteAllLikesRelated(tid);
        const deleteDislikes = this.dislikeDao.deleteAllDislikesRelated(tid);
        const deleteBookmarks = this.bookmarkDao.deleteAllBookmarksRelated(tid);
        // when user delete a tuit, also need to delete all records related to this tuit
        return Promise.all([deleteTuit, deleteLikes, deleteDislikes, deleteBookmarks]);
    }


    // just for test, delete tuit by content
    deleteTuitByContent = (req: Request, res: Response) =>
        this.tuitDao.deleteTuitByContent(req.params.content)
            .then(status => res.json(status));

    private async addProperty(tuits: Tuit[], userId: string) {
        for (let i = 0; i < tuits.length; i++) {
            const userAlreadyLikedTuit = await this.likeDao.findUserLikesTuit(userId, tuits[i]._id);
            const userAlreadyDislikedTuit = await this.dislikeDao.findUserDislikesTuit(userId, tuits[i]._id)
            const userAlreadyBookmarkedTuit = await this.bookmarkDao.findUserBookmarksTuit(userId, tuits[i]._id)
            //add isliked/isDisliked/isBookmarked property
            tuits[i].isLiked = Boolean(userAlreadyLikedTuit);
            tuits[i].isDisliked = Boolean(userAlreadyDislikedTuit)
            tuits[i].isBookmarked = Boolean(userAlreadyBookmarkedTuit)
        }
    }
}