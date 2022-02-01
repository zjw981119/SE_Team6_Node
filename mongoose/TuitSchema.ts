import mongoose from "mongoose";
import User from "../models/User";

/**
 * Create the TuitSchema to represent tuit document instances stored in a MongoDB database.
 */
const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postedOn: {type: Date, default: Date.now},
    postedBy: User,
},{collection: 'tuits'});

export default TuitSchema;
