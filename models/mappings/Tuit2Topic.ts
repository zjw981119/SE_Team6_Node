import Topic from "../tuits/Topic";
import Tuit from "../tuits/Tuit";

/**
 * Mapping class which replace many to many relationships between Tuit and Topic classes.
 */
export default interface Tuit2Topic{
    topic: Topic;
    tuit: Tuit;
}