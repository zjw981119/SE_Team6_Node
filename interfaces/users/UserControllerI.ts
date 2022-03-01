/**
 * @file Declares API for users related HTTP request methods.
 * Handle HTTP events that create, read, update and delete user instances.
 *
 */
import {Request, Response} from "express";

export default interface UserControllerI {
    findAllUsers(req: Request, res: Response): void;
    findUserById(req: Request, res: Response): void;
    createUser(req: Request, res: Response): void;
    deleteUser(req: Request, res: Response): void;
    deleteUserByUsername(req: Request, res: Response): void;
    updateUser(req: Request, res: Response): void;
}
