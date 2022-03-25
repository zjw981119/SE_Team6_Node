import Tuit from "../tuits/Tuit";
import User from "../users/User";

/**
 * @class DisLike Represents dislikes relationship between a user and a tuit,
 * as in a user dislikes a tuit
 * @property {Tuit} tuit Tuit being disliked
 * @property {User} likedBy User disliking the tuit
 */
export default class Dislike {
    tuit: Tuit | null = null;
    dislikedBy: User | null = null;
};