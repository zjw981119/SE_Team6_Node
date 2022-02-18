import User from "../users/User";
import Tuit from "../tuits/Tuit";

/**
 * @class Bookmark Represents bookmarks relationship between a user and a tuit,
 * as in a user bookmarks a tuit
 * @property {Tuit} bookmarkedTuit tuit being bookmarked
 * @property {User} bookmarkedBy user bookmarking the tuit
 */
export default class Bookmark {
    bookmarkedTuit: Tuit | null = null;
    bookmarkedBy: User | null = null;
};