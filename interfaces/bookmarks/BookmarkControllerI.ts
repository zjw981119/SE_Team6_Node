/**
 * @file Declares API for bookmarks related HTTP request methods.
 * Handle HTTP events that create, read, update and delete bookmark instances.
 */
import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllTuitsBookmarkedByUser (req: Request, res: Response): void;
    findTuitsBookmarkedBasedOnTags (req: Request, res: Response): void;
    userTogglesTuitBookmarks (req: Request, res: Response): void;

};