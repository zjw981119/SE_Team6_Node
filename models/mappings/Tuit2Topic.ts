import Topic from "../tuits/Topic";
import Tuit from "../tuits/Tuit";

/**
 * Mapping class which replace many to many relationships between Tuit and Topic classes.
 */
export default class Tuit2Topic{
    private topic: Topic = new Topic();
    private tuit: Tuit = new Tuit();
}