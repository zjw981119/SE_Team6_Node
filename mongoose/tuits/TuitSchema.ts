import mongoose, {Schema} from "mongoose";

/**
 * Create the TuitSchema to represent tuit document instances stored in a MongoDB database.
 */
const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postedOn: {type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
},{collection: 'tuits'});

export default TuitSchema;
