/**
 * @file Implements mongoose model to CRUD
 * documents in the tuits collection
 */
import mongoose from "mongoose";
import TuitSchema from "./TuitSchema";
//create TuitModel to interact with mongoose database
const TuitModel = mongoose.model('TuitModel', TuitSchema);
export default TuitModel;
