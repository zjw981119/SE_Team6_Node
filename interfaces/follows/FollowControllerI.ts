/**
 * @file Declares API for follows related HTTP request methods.
 * Handle HTTP events that create, read, update and delete like instances.
 */
import {Request, Response} from "express";

export default interface FollowControllerI {
    findAllUsersFollowedByUser (req: Request, res: Response): void;
    findAllFollowers (req: Request, res: Response): void;
    userFollowsAnotherUser (req: Request, res: Response): void;
    userUnfollowsAnotherUser (req: Request, res: Response): void;
};