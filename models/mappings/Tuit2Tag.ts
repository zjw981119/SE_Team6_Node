import Tag from "../tuits/Tag";
import Tuit from "../tuits/Tuit";
/**
 * Mapping class which replace many to many relationships between Tuit and Tag classes.
 */
export default interface Tuit2Tag{
    tag: Tag;
    tuit: Tuit;
}