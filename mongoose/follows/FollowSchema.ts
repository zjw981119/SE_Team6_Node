import mongoose, {Schema} from "mongoose";
import Follow from "../../models/mappings/Follows";

/**
 * Create the LikeSchema to represent like document instances stored in a MongoDB database.
 * @typedef Like represents like relationship between a user and a tuit
 * @property {ObjectId} tuit tuit reference
 * @property {ObjectId} likedBy user reference
 *
 */
//<Follow> is able to check the properties at compile time
const FollowSchema = new mongoose.Schema<Follow>({
    user: {type: Schema.Types.ObjectId, ref: "UserModel"},
    follower: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "follows"});
export default FollowSchema;