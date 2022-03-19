/**
 * @file Implements mongoose model to CRUD
 * documents in the dislikes collection
 */
import mongoose from "mongoose";
import DislikeSchema from "./DislikeSchema";
//create DislikeModel to interact with mongoose database
//name of model can be used as ref name in another Schema
const DislikeModel = mongoose.model('DislikeModel', DislikeSchema);
export default DislikeModel;