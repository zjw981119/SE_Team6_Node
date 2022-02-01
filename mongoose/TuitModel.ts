import mongoose from "mongoose";
import TuitSchema from "./TuitSchema";
//create TuitModel to interact with mongoose database
const TuitModel = mongoose.model('TuitModel', TuitSchema);
export default TuitModel;
