import Tuit from "../models/Tuit";
import TuitModel from "../mongoose/TuitModel";
import TuitDaoI from "../interfaces/TuitDao";

/**
 * daos/TuitDao class implements interfaces/TuitDao interface.
 */
export default class TuitDao implements TuitDaoI{

    async findAllTuits(): Promise<Tuit[]> {
        return TuitModel.find();
    }

    async findTuitById(tid: string): Promise<Tuit> {
        return TuitModel.findById(tid);
    }

    async findTuitsByUser(uid: string): Promise<Tuit[]> {
        return TuitModel.findById(uid);
    }

    async createTuit(tuit: Tuit): Promise<Tuit> {
        return await TuitModel.create(tuit);
    }

    async deleteTuit(tid: string): Promise<any> {
        return TuitModel.deleteOne({_id: tid});
    }

    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
        return TuitModel.updateOne({_id: tid}, {$set: tuit});
    }

}