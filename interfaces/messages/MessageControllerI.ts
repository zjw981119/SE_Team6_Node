/**
 * @file Declares API for messages related HTTP request methods.
 * Handle HTTP events that create, read, update and delete message instances.
 */
import {Request, Response} from "express";

export default interface MessageControllerI {
    findAllMessagesSentByUser (req: Request, res: Response): void;
    findAllMessagesSentToUser (req: Request, res: Response): void;
    userSendsMessage (req: Request, res: Response): void;
    userDeletesMessage (req: Request, res: Response): void;
    findAllContacts (req: Request, res: Response): void;
};