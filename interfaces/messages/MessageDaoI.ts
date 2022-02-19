/**
 * @file Declares API for messages related data access object methods
 */
import Message from "../../models/messages/Message";

export default interface MessageDaoI {
    findAllMessagesSentByUser (uid: string): Promise<Message[]>;
    findAllMessagesSentToUser (uid: string): Promise<Message[]>;
    userSendsMessage (uid1: string, uid2: string, message: Message): Promise<Message>;
    userDeletesMessage (mid: string): Promise<any>;
};