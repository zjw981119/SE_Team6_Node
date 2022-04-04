/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/messages/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import UserDao from "../daos/UserDao";

/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/messages to retrieve all the messages that sent from a user </li>
 *     <li>GET /messages/users/:uid to retrieve all the messages that sent to a user </li>
 *     <li>GET /messages/contacts to retrieve all the contacts excluding login user </li>
 *     <li>POST /users/:uid/messages/:uid to record that a user sends message to another user </li>
 *     <li>DELETE /messages/:mid to record that a message being deleted </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} messageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static userDao: UserDao = UserDao.getInstance();
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @return followController
     */
    public static getInstance = (app: Express): MessageController => {
        if(MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/users/:uid/messages", MessageController.messageController.findAllMessagesSentByUser);
            app.get("/messages/users/:uid", MessageController.messageController.findAllMessagesSentToUser);
            app.get("/messages/:uid/contacts", MessageController.messageController.findAllContacts);
            app.post("/users/:sender/messages/:receiver", MessageController.messageController.userSendsMessage);
            app.delete("/messages/:mid", MessageController.messageController.userDeletesMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Retrieves all messages that sent by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves all messages that sent to a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentToUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentToUser(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieve all the contacts of the login user
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllContacts = async (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "my" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        // avoid server crash
        if (userId === "my") {
            res.sendStatus(503);
            return;
        }
        const contacts = await MessageController.userDao.findAllContacts(userId);
        return res.json(contacts);
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user that is messaging
     * the other user and the other user being messaged
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new message that was inserted in the
     * database
     */
    userSendsMessage = (req: Request, res: Response) => {
        // @ts-ignore
        let senderId = req.params.sender === "me" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.sender;
        let receiverId = req.params.receiver;
        // avoid server crash
        if (senderId === "me") {
            res.sendStatus(503);
            return;
        }
        MessageController.messageDao.userSendsMessage(senderId, receiverId, req.body)
            .then(message => res.json(message));
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the message that is being deleted
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then(status => res.send(status));
};