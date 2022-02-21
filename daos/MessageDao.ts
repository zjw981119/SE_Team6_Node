/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/messages/MessageDaoI";
import Message from "../models/messages/Message";
import MessageModel from "../mongoose/messages/MessageModel";

/**
 * @class MessageDao Implements Data Access Object managing data storage of messages
 * @implements {MessageDaoI} MessageDaoI
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns messageDao
     */
    public static getInstance = (): MessageDao => {
        if(MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }
    private constructor() {}

    /**
     * Retrieve all messages that sent by a user
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the messages are retrieved from database
     */
    public findAllMessagesSentByUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({sentFrom: uid})
            .exec();

    /**
     * Retrieve all messages that sent to a user
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the messages are retrieved from database
     */
    public findAllMessagesSentToUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({sentTo: uid})
            .exec();

    /**
     * Inserts follow instance into the database
     * @param {string} uid1 User's primary key
     * @param {string} uid2 User's primary key
     * @param {Message} message Instance to be inserted into the database
     * @returns {Promise} To be notified when message is inserted into the database
     */
    public userSendsMessage = async (uid1: string, uid2: string, message: Message): Promise<Message> =>
        //use "..." to parse object into key-value pairs instead of casting message object to string
        MessageModel.create({...message, sentFrom: uid1, sentTo: uid2});

    /**
     * Removes follow instance from the database
     * @param {string} mid Message's primary key
     * @returns {Promise} To be notified when message is removed from the database
     */
    public userDeletesMessage = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id: mid});
}