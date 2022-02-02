import Tuit from "../models/Tuit";
import TuitModel from "../mongoose/tuits/TuitModel";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * Implements Data Access Object managing data storage
 * of tuits
 * @implements {TuitDaoI} TuitDaoI
 * @property {TuitDao} tuitDao Private single instance of TuitDaoI
 */
export default class TuitDao implements TuitDaoI {

    //use Singleton to create a TuitDaoI instance
    private static tuitDao: TuitDao | null = null;
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }

    private constructor() {
    }

    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find().exec();

    //Populated paths are no longer set to their original _id ,
    //their value is replaced with the mongoose document returned from the database
    //by performing a separate query before returning the results.
    findTuitById = async (tid: string): Promise<Tuit> =>
        TuitModel.findById(tid)
            .populate("postedBy")
            .exec();

    findTuitsByUser=async(uid: string): Promise<Tuit[]> =>
         TuitModel.find({postedBy: uid}).exec();

    createTuit = async (tuit: Tuit): Promise<Tuit> =>
        await TuitModel.create(tuit);

    deleteTuit = async (uid: string): Promise<any> =>
        TuitModel.deleteOne({_id: uid});

    updateTuit = async (uid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: uid},
            {$set: tuit});

}