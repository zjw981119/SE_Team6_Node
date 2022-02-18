/**
 * @file Controller RESTful Web service API for follows resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import LikeControllerI from "../interfaces/likes/LikeControllerI";
import FollowControllerI from "../interfaces/follows/FollowControllerI";
import FollowDao from "../daos/FollowDao";

/**
 * @class FollowController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/follows to retrieve all the users that followed by a user </li>
 *     <li>GET /users/:uid/followers to retrieve all the users that follow a user </li>
 *     <li>POST /users/:uid1/follows/:uid2 to record that a user follows another user </li>
 *     <li>DELETE /users/:uid1/follows/:uid2 to record that a user
 *     no londer follows another user</li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing likes CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @return followController
     */
    public static getInstance = (app: Express): FollowController => {
        if(FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.get("/users/:uid/follows", FollowController.followController.findAllUsersFollowedByUser);
            app.get("/users/:uid/followers", FollowController.followController.findAllFollowers);
            app.post("/users/:uid1/follows/:uid2", FollowController.followController.userFollowsAnotherUser);
            app.delete("/users/:uid1/follows/:uid2", FollowController.followController.userUnfollowsAnotherUser);
        }
        return FollowController.followController;
    }

    private constructor() {}

    /**
     * Retrieves all users that followed by another user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersFollowedByUser = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersFollowedByUser(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves all users that follow another user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that is being followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects that were liked
     */
    findAllFollowers = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowers(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user that is following
     * the other user and the other user being followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follow that was inserted in the
     * database
     */
    userFollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(follows => res.json(follows));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user that is un following
     * the other user and the other user being unfollowed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnfollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(status => res.send(status));
};