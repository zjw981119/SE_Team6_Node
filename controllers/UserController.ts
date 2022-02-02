import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
import UserControllerI from "../interfaces/UserControllerI";

/**
 * UserControllerI class implements interfaces/UserControllerI.
 */
export default class UserController implements UserControllerI {

    private userDao: UserDao = UserDao.getInstance();

    //use Singleton design pattern to get a UserControllerI instance
    private static userController: UserController | null = null;
    public static getInstance = (app: Express): UserController => {
        if (UserController.userController === null) {
            UserController.userController = new UserController();
            //define HTTP request address
            app.get("/users", UserController.userController.findAllUsers);
            app.get("/users/:uid", UserController.userController.findUserById);
            app.post("/users", UserController.userController.createUser);
            app.put("/users/:uid", UserController.userController.updateUser);
            app.delete("/users/:uid", UserController.userController.deleteUser);
        }
        return UserController.userController;
    }

    private constructor() {}

    //retrieves all users from database
    findAllUsers = (req: Request, res: Response) =>
        this.userDao.findAllUsers()
            .then(users => res.json(users));

    //retrieves user from database whose primary key is uid
    findUserById = (req: Request, res: Response) =>
        this.userDao.findUserById(req.params.uid)
            .then(user => res.json(user));

    //parses user from HTTP body, inserts into database, responds with inserted user
    createUser = (req: Request, res: Response) =>
        this.userDao.createUser(req.body)
            .then(user => res.json(user))

    //removes user from database whose primary key is uid
    deleteUser = (req: Request, res: Response) =>
        this.userDao.deleteUser(req.params.uid)
            .then(status => res.json(status));

    //parses user updates from HTTP body, updates user in database whose primary key is uid
    updateUser = (req: Request, res: Response) =>
        this.userDao.updateUser(req.params.uid, req.body)
            .then(status => res.json(status));

}