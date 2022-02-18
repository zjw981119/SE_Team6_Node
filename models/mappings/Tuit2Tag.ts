import Tag from "../tuits/Tag";
import Tuit from "../tuits/Tuit";
/**
 * Mapping class which replace many to many relationships between Tuit and Tag classes.
 */
export default class Tuit2Tag{
    private tag: Tag = new Tag();
    private tuit: Tuit = new Tuit();
}