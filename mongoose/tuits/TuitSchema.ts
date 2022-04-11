/**
 * @file Implements mongoose schema for tuits
 */

import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";

/**
 * Create the TuitSchema to represent tuit document instances stored in a MongoDB database.
 * @typedef Tuit represents a tuiter
 * @property {String} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 * @property {Number} replies reply number
 * @property {Number} retuits retuit number
 * @property {Number} likes like number
 *
 */
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    tag: {type: String, default: ""},
    postedOn: {type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    // initialize tuit's stats attribute
    stats: {
        replies: {type: Number, default: 0},
        retuits: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0}
    }
}, {collection: 'tuits'});

export default TuitSchema;
