/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/likes/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/mappings/Likes";

/**
 * @class LikeDao Implements Data Access Object managing data storage of likes
 * @implements {LikeDaoI} LikeDaoI
 * @property {likeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns likeDao
     */
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {
    }

    /**
     * Retrieve all users documents from likes collection
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when the users are retrieved from database
     */
    public findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Retrieve all tuits documents from likes collection
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the tuits are retrieved from database
     */
    public findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .lean()
            .populate({
                path: "tuit",
                populate:{
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Inserts like instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when like is inserted into the database
     */
    public userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Removes like instance from the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when like is removed from the database
     */
    public userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});

    /**
     * Counts the total likes a particular tuit has
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when total count is calculated
     */
    public countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});

    /**
     * Find out if a user has liked a particular tuit
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when data is retrived from the database
     */
    public findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid});


}