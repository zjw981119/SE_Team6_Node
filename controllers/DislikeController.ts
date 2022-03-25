/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import TuitDao from "../daos/TuitDao";
import DislikeControllerI from "../interfaces/dislikes/DislikeCotrollerI";
import DislikeDao from "../daos/DislikeDao";
import Tuit from "../models/tuits/Tuit";

/**
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/dislikes to retrieve all the tuits disliked by a user </li>
 *     <li>GET /users/:uid/dislikes/:tid to retrieve the dislike distance with particular user and tuit</li>
 *     <li>PUT /users/:uid/dislikes/:tid to record that a user toggles dislike in a tuit </li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {DislikeController} dislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @return dislikeController
     */
    public static getInstance = (app: Express): DislikeController => {
        if(DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.get("/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikesTuit);
            app.put("/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
        }
        return DislikeController.dislikeController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then( async dislikes => {
                // filter out dislikes with null tuit
                const dislikesNonNullTuits = dislikes.filter(like => like.tuit);
                // extract tuit objects and assign them to elements in the new array
                const tuitsFromLikes = dislikesNonNullTuits.map(like => like.tuit);
                //update isLiked/isDisliked properties
                await this.addProperty(tuitsFromLikes, userId)
                res.json(tuitsFromLikes);
            });
    }


    /**
     * Retrieves the dislike data with particular user and tuit
     * @param {Request} req Represents request from client, including the path
     * parameter uid and tid representing the user that is disliking the tuit,
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findUserDislikesTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        DislikeController.dislikeDao.findUserDislikesTuit(userId, tid)
            .then(dislikes => res.json(dislikes))
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new dislikes that was inserted in the
     * database
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const likeDao = DislikeController.likeDao;
        const tuitDao = DislikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        // if logged in, get ID from profile, otherwise use parameter
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            // check if user already has liked tuit
            const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);
            const dislikeNumber = await dislikeDao.countHowManyDislikedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyDislikedTuit) {
                // user undislikes tuit
                await dislikeDao.userUndislikesTuit(userId, tid);
                tuit.stats.dislikes = dislikeNumber - 1;
            } else {
                // user dislikes tuit
                await dislikeDao.userDislikesTuit(userId, tid);
                tuit.stats.dislikes = dislikeNumber + 1;

                // if user liked this tuit before, unlike this tuit
                const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
                const likeNumber = await likeDao.countHowManyLikedTuit(tid);
                if(userAlreadyLikedTuit){
                    await likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = likeNumber - 1;
                }
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
            const userAlreadyLikedTuit = await DislikeController.likeDao.findUserLikesTuit(userId, tuits[i]._id);
            const userAlreadyDislikedTuit = await DislikeController.dislikeDao.findUserDislikesTuit(userId, tuits[i]._id)
            //update isliked/isDisliked property
            tuits[i].isLiked = Boolean(userAlreadyLikedTuit);
            tuits[i].isDisliked = Boolean(userAlreadyDislikedTuit)
        }
    }
};