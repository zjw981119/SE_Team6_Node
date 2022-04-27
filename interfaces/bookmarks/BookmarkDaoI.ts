/**
 * @file Declares API for bookmarks related data access object methods
 */
import Bookmark from "../../models/mappings/Bookmarks";

export default interface BookmarkDaoI {
    findAllTuitsBookmarkedByUser (uid: string): Promise<Bookmark[]>;
    userBookmarksTuit (uid: string, tid: string): Promise<Bookmark>;
    userUnbookmarksTuit (uid: string, tid: string): Promise<any>;
    countHowManyBookmarkedTuit (uid: string, tid: string): Promise<any>;
    findUserBookmarksTuit (uid: string, tid: string): Promise<any>;
};