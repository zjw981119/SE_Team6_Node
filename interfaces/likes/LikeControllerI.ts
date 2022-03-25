/**
 * @file Declares API for likes related HTTP request methods.
 * Handle HTTP events that create, read, update and delete like instances.
 */
import {Request, Response} from "express";

export default interface LikeControllerI {
    findAllUsersThatLikedTuit (req: Request, res: Response): void;
    findAllTuitsLikedByUser (req: Request, res: Response): void;
    findUserLikesTuit (req: Request, res: Response): void;
    userTogglesTuitLikes (req: Request, res: Response): void;
};