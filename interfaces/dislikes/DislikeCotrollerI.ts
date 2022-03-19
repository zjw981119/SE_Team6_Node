import {Request, Response} from "express";
/**
 * @file Declares API for dislikes related HTTP request methods.
 * Handle HTTP events that create, read, and delete dislike instances.
 */
export default interface DislikeControllerI {
    findAllTuitsDislikedByUser(req: Request, res: Response): void;
    findUserDislikesTuit(req: Request, res: Response): void;
    userTogglesTuitDislikes(req: Request, res: Response): void;
}
