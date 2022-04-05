import User from "../users/User";

/**
 * @property {string} message message's content
 * @property {User} sentFrom message's sender
 * @property {User} sentTo message's receiver
 * @property {Date} sentOn message's creation time
 */
export default interface Message{
    _id?: string;
    message: string;
    sentFrom: User;
    sentTo: User;
    sentOn: Date;
}