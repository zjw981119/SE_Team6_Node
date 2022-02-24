/**
 * @file Declares API for follows related data access object methods
 */
import Follow from "../../models/mappings/Follows";

export default interface FollowDaoI {
    findAllUsersFollowedByUser (uid: string): Promise<Follow[]>;
    findAllFollowers (uid: string): Promise<Follow[]>;
    findAllFollows() : Promise<Follow[]>;
    userFollowsAnotherUser (uid1: string, uid2: string): Promise<Follow>;
    userUnfollowsAnotherUser (uid1: string, uid2: string): Promise<any>;

};