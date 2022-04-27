/**
 * @file Implements DAO managing data storage of dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/dislikes/DislikeDaoI";
import Dislike from "../models/mappings/Dislikes";
import DislikeModel from "../mongoose/dislikes/DislikeModel";

/**
 * @class DislikeDao Implements Data Access Object managing data storage of dislikes
 * @implements {DislikeDaoI} DislikeDaoI
 * @property {DislikeDao} dislikeDao Private single instance of DislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns likeDao
     */
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    private constructor() {}


    /**
     * Retrieve all tuits documents from dislikes collection
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the tuits are retrieved from database
     */
    public findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({dislikedBy: uid})
            .lean()
            .populate({
                path: "tuit",
                populate:{
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Inserts dislike instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when dislike is inserted into the database
     */
    public userDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Removes dislikes instances related to one particular tuit from the database
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when dislikes are removed from the database
     */
    public deleteAllDislikesRelated = async (tid: string): Promise<any> =>
        DislikeModel.deleteMany({tuit: tid});

    /**
     * Removes dislike instance from the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when dislike is removed from the database
     */
    public userUndislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});

    /**
     * Counts the total dislikes a particular tuit has
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when total count is calculated
     */
    public countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});

    /**
     * Find out if a user has disliked a particular tuit
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when data is retrived from the database
     */
    public findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});


}