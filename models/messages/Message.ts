import User from "../users/User";

/**
 * @class Message Represents a message sent by a user to another user
 * @property {string} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 */
export default class Message{
    private content: string = '';
    private sentFrom: User | null = null;
    private sentTo: User | null = null;
    private sentOn: Date = new Date();
}