import User from "./User";

/**
 * Tuit class represents tuit content(tuit), poster and post time.
 */
export default class Tuit{
    private tuit: string = '';
    private postedOn: Date = new Date();
    private postedBy: User | null = null;
}