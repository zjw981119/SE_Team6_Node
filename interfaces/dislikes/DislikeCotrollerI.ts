import {Request, Response} from "express";
/**
 * @file Declares API for likes related HTTP request methods.
 * Handle HTTP events that create, read, and delete dislike instances.
 */
export default interface DislikeControllerI {
    findAllTuitsDislikedByUser(req: Request, res: Response): void;

    userTogglesTuiDislikes(req: Request, res: Response): void;
}
