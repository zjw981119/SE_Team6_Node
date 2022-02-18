import Tuit from "../models/Tuit";

/**
 * @file Declares API for tuits related data access object methods
 */
export default interface TuitDaoI {
    findAllTuits(): Promise<Tuit[]>;
    findTuitsByUser(uid: string): Promise<Tuit[]>;
    findTuitById(tid: string): Promise<Tuit>;
    createTuitByUser(uid: string, tuit: Tuit): Promise<Tuit>;
    updateTuit(tid: string, tuit: Tuit): Promise<any>;
    deleteTuit(tid: string): Promise<any>;
}
