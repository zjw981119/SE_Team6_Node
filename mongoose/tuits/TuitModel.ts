/**
 * @file Implements mongoose model to CRUD
 * documents in the tuits collection
 */
import mongoose from "mongoose";
import TuitSchema from "./TuitSchema";
//create TuitModel to interact with mongoose database
//name of model can be used as ref name in another Schema
const TuitModel = mongoose.model('TuitModel', TuitSchema);
export default TuitModel;
