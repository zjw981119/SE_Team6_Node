import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";

/**
 * Create the TuitSchema to represent tuit document instances stored in a MongoDB database.
 * @typedef Tuit represents a tuiter
 * @property {String} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 *
 */
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedOn: {type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
},{collection: 'tuits'});

export default TuitSchema;
