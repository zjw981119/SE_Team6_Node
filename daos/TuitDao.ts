/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import Tuit from "../models/tuits/Tuit";
import TuitModel from "../mongoose/tuits/TuitModel";
import TuitDaoI from "../interfaces/tuits/TuitDaoI";

/**
 * @class TuitDao Implements Data Access Object managing data storage of tuits
 * @implements {TuitDaoI} TuitDaoI
 * @property {TuitDao} tuitDao Private single instance of TuitDao
 */
export default class TuitDao implements TuitDaoI {

    //use Singleton to create a TuitDaoI instance
    private static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }

    private constructor() {
    }

    /**
     * Retrieve all tuit documents from tuits collection
     * @returns {Promise} To be notified when the tuits are retrieved from database
     */
    public findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find().exec();

    //Populated paths are no longer set to their original _id ,
    //their value is replaced with the mongoose document returned from the database
    //by performing a separate query before returning the results.
    /**
     * Retrieve single user document from tuits collection
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when tuit is retrieved from the database
     */
    public findTuitById = async (tid: string): Promise<Tuit> =>
        TuitModel
            .findById(tid)
            .populate("postedBy")
            .exec();

    /**
     * Retrieve one user's all tuits documents from tuits collection
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when tuits are retrieved from the database
     */
    public findTuitsByUser=async(uid: string): Promise<Tuit[]> =>
         TuitModel
             .find({postedBy: uid})
             .exec();

    /**
     * Inserts tuit instance into the database
     * @param {string} uid User's primary key
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns {Promise} To be notified when tuit is inserted into the database
     */
    public createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        await TuitModel.create({tuit, postedBy: uid});

    /**
     * Removes tuit from the database.
     * @param {string} tid Primary key of tuit to be removed
     * @returns {Promise} To be notified when tuit is removed from the database
     */
    public deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});

    /**
     * Updates tuit with new values in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {Tuit} tuit Tuit object containing properties and their new values
     * @returns {Promise} To be notified when tuit is updated in the database
     */
    public updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: tuit});

}