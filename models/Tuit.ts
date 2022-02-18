import User from "./User";

/**
 * Tuit class represents tuit content(tuit), post time and poster.
 * @property {String} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 */
export default class Tuit{
    private tuit: string = '';
    private postedOn: Date = new Date();
    private postedBy: User | null = null;
}