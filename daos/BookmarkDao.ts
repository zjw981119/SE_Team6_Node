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
     * @param {String} uid User's primary key
     * @returns {Promise} To be notified when the tuits are retrieved from database
     */
    public findAllTuitsBookmarkedByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .populate("bookmarkedTuit")
            .exec();

    /**
     * Inserts bookmark instance into the database
     * @param {string} uid User's primary key
     * @param {String} tid Tuit's primary key
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
}