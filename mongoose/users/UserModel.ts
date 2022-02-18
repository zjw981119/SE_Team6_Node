/**
 * @file Implements mongoose model to CRUD
 * documents in the users collection
 */
import mongoose from "mongoose";
import UserSchema from "./UserSchema";
//create UserModel to interact with mongoose database
const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;
