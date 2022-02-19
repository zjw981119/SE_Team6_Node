import mongoose, {Schema} from "mongoose";
import Message from "../../models/messages/Message";

/**
 * Create the MessageSchema to represent message document instances stored in a MongoDB database.
 * @typedef Message represents a message
 * @property {String} content message's content
 * @property {ObjectId} sentFrom user reference
 * @property {ObjectId} sentTo user reference
 * @property {Date} sentOn message's creation time
 *
 */
const MessageSchema = new mongoose.Schema<Message>({
    content: {type: String, required: true},
    sentFrom: {type: Schema.Types.ObjectId, ref: "UserModel"},
    sentTo: {type: Schema.Types.ObjectId, ref: "UserModel"},
    sentOn: {type: Date, default: Date.now},
},{collection: 'messages'});

export default MessageSchema;
