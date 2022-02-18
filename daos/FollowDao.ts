/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/follows/FollowDaoI";
import Follow from "../models/mappings/Follows";
import FollowModel from "../mongoose/follows/FollowModel";

/**
 * @class LikeDao Implements Data Access Object managing data storage of likes
 * @implements {LikeDaoI} LikeDaoI
 * @property {likeDao} likeDao Private single instance of LikeDao
 */
export default class FollowDao implements FollowDaoI {
    private static followDao: FollowDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns followDao
     */
    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    /**
     * Retrieve all users that one user are following
     * @param {string} uid Follower(User)'s primary key
     * @returns {Promise} To be notified when the users are retrieved from database
     */
    public findAllUsersFollowedByUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({follower: uid})
            .populate("user")
            .exec();

    /**
     * Retrieve all users that following one user
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the users are retrieved from database
     */
    public findAllFollowers = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({user: uid})
            .populate("follower")
            .exec();

    /**
     * Inserts follow instance into the database
     * @param {string} uid1 Follower(User)'s primary key
     * @param {String} uid2 User's primary key
     * @returns {Promise} To be notified when follow is inserted into the database
     */
    public userFollowsAnotherUser = async (uid1: string, uid2: string): Promise<Follow> =>
        FollowModel.create({follower: uid1, user: uid2});

    /**
     * Removes follow instance from the database
     * @param {string} uid1 Follower(User)'s primary key
     * @param {String} uid2 User's primary key
     * @returns {Promise} To be notified when follow is removed from the database
     */
    public userUnfollowsAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.deleteOne({follower: uid1, user: uid2});
}