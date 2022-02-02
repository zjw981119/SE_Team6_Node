import mongoose from "mongoose";
import UserSchema from "./UserSchema";
//create UserModel to interact with mongoose database
const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;
