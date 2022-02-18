/**
 * @file Declares API for tuits related HTTP request methods.
 * Handle HTTP events that create, read, update and delete tuit instances.
 */
import {Request, Response} from "express";

export default interface TuitController {
    findAllTuits(req: Request, res: Response): void;
    findTuitById(req: Request, res: Response): void;
    findTuitsByUser(req: Request, res: Response): void;
    createTuitByUser(req: Request, res: Response): void;
    updateTuit(req: Request, res: Response): void;
    deleteTuit(req: Request, res: Response): void;
}
