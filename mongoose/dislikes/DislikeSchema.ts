/**
 * @file Implements mongoose schema for dislikes
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../../models/mappings/Dislikes";

/**
 * Create the DislikeSchema to represent dislike document instances stored in a MongoDB database.
 * @typedef Dislike represents dislike relationship between a user and a tuit
 * @property {ObjectId} tuit tuit reference
 * @property {ObjectId} dislikedBy user reference
 *
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "dislikes"});
export default DislikeSchema;