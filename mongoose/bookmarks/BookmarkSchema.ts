import mongoose, {Schema} from "mongoose";
import Bookmark from "../../models/mappings/Bookmarks";

/**
 * Create the BookmarkSchema to represent bookmark document instances stored in a MongoDB database.
 * @typedef Bookmark represents bookmark relationship between a user and a tuit
 * @property {ObjectId} tuit tuit reference
 * @property {ObjectId} likedBy user reference
 *
 */
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    bookmarkedTuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    bookmarkedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "bookmarks"});
export default BookmarkSchema;