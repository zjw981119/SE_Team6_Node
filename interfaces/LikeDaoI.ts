/**
 * @file Declares API for Likes related data access object methods
 */
import Like from "../models/mappings/Likes";

export default interface LikeDaoI {
    findAllUsersThatLikedTuit (tid: string): Promise<Like[]>;
    findAllTuitsLikedByUser (uid: string): Promise<Like[]>;
    userLikesTuit (tid: string, uid: string): Promise<Like>;
    userUnlikesTuit (tid: string, uid: string): Promise<any>;
};