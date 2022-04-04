/**
 * @file Declares API for messages related data access object methods
 */
import Message from "../../models/messages/Message";

export default interface MessageDaoI {
    findAllMessagesSentByUser (uid: string): Promise<Message[]>;
    findAllMessagesSentToUser (uid: string): Promise<Message[]>;
    userSendsMessage (sender: string, receiver: string, message: Message): Promise<Message>;
    userDeletesMessage (mid: string): Promise<any>;
};