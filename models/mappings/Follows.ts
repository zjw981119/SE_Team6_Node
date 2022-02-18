import User from "../users/User";

/**
 * @class Follow Represents follows relationship between a user and another user,
 * as in a user follows another user
 * @property {User} user user being followed
 * @property {User} follower another user following this user
 */
export default class Follow {
    user: User | null = null;
    follower: User | null = null;
};