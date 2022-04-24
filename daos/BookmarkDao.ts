/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/bookmarks/BookmarkDaoI";
import Bookmark from "../models/mappings/Bookmarks";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage of bookmarks
 * @implements {BookmarkDaoI} BookmarkDaoI
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns bookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    /**
     * Retrieve all tuits documents from bookmarks collection
     * @param {string} uid User's primary key
     * @returns {Promise} To be notified when the tuits are retrieved from database
     */
    public findAllTuitsBookmarkedByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .lean()
            .populate({
                path: "bookmarkedTuit",
                populate:{
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Inserts bookmark instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when bookmark is inserted into the database
     */
    public userBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({bookmarkedTuit: tid, bookmarkedBy: uid});

    /**
     * Removes bookmark instance from the database
     * @param {string} uid User's primary key
     * @param {String} tid Tuit's primary key
     * @returns {Promise} To be notified when bookmark is removed from the database
     */
    public userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedTuit: tid, bookmarkedBy: uid});

    /**
     * Counts the total bookmarks a particular tuit has
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when total count is calculated
     */
    public countHowManyBookmarkedTuit = async (tid: string): Promise<any> =>
        BookmarkModel.count({bookmarkedTuit: tid});

    /**
     * Find out if a user has bookmarked a particular tuit
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns {Promise} To be notified when data is retrived from the database
     */
    public findUserBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.findOne({bookmarkedTuit: tid, bookmarkedBy: uid});
}