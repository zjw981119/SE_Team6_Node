import User from "../users/User";
import Stats from "./Stats";

/**
 * @property {string} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 * @property {Stats} stats stats of tuit
 */
export default interface Tuit{
    _id?: string;
    tuit: string;
    postedOn: Date;
    postedBy: User;
    stats: Stats;
    isLiked?: boolean; //mark as optional so this property can be added later
    isDisliked?: boolean;
}