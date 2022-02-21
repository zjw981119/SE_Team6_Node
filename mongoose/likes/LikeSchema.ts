/**
 * @file Implements mongoose schema for likes
 */
import mongoose, {Schema} from "mongoose";
import Like from "../../models/mappings/Likes";

/**
 * Create the LikeSchema to represent like document instances stored in a MongoDB database.
 * @typedef Like represents like relationship between a user and a tuit
 * @property {ObjectId} tuit tuit reference
 * @property {ObjectId} likedBy user reference
 *
 */
const LikeSchema = new mongoose.Schema<Like>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    likedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "likes"});
export default LikeSchema;