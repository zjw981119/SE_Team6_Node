import {Request, Response} from "express";

/**
 * UserControllerI interface declare functions to handle HTTP events
 * that create, read, update and delete user instances.
 */
export default interface UserControllerI {
    findAllUsers(req: Request, res: Response): void;
    findUserById(req: Request, res: Response): void;
    createUser(req: Request, res: Response): void;
    deleteUser(req: Request, res: Response): void;
    updateUser(req: Request, res: Response): void;
}
