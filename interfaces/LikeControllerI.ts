/**
 * @file Declares API for likes related HTTP request methods.
 * Handle HTTP events that create, read, update and delete like instances.
 */
import {Request, Response} from "express";

export default interface LikeControllerI {
    findAllUsersThatLikedTuit (req: Request, res: Response): void;
    findAllTuitsLikedByUser (req: Request, res: Response): void;
    userLikesTuit (req: Request, res: Response): void;
    userUnlikesTuit (req: Request, res: Response): void;
};