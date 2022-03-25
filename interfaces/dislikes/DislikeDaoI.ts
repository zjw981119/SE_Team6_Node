/**
 * @file Declares API for dislikes related data access object methods
 */
import Dislike from "../../models/mappings/Dislikes";

export default interface DislikeDaoI {
    findAllTuitsDislikedByUser (uid: string): Promise<Dislike[]>;
    userDislikesTuit (uid: string, tid: string): Promise<Dislike>;
    userUndislikesTuit (uid: string, tid: string): Promise<any>;
    countHowManyDislikedTuit (tid: string): Promise<any>;
    findUserDislikesTuit (uid: string, tid: string): Promise<Dislike>;
};