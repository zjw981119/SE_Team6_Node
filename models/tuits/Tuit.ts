import User from "../users/User";
import Stats from "./Stats";

/**
 * @class Tuit Represents a tuit posted by a user
 * @property {string} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 * @property {Stats} stats stats of tuit
 */
export default class Tuit{
    tuit: string = '';
    postedOn: Date = new Date();
    postedBy: User | null = null;
    stats: Stats
}