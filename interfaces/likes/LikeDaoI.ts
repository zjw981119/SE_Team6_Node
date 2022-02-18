/**
 * @file Declares API for Likes related data access object methods
 */
import Like from "../../models/mappings/Likes";

export default interface LikeDaoI {
    findAllUsersThatLikedTuit (tid: string): Promise<Like[]>;
    findAllTuitsLikedByUser (uid: string): Promise<Like[]>;
    userLikesTuit (uid: string, tid: string): Promise<Like>;
    userUnlikesTuit (uid: string, tid: string): Promise<any>;
};