import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitControllerI";


/**
 * TuitController class implements interfaces/TuitController.
 */
export default class TuitController implements TuitControllerI {
    private tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitController: TuitController | null = null;

    //use Singleton design pattern to get a UserControllerI instance
    public static getInstance = (app: Express): TuitController => {
        if(TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            //define HTTP request address
            app.get("/tuits", TuitController.tuitController.findAllTuits);
            app.get("/users/:uid/tuits", TuitController.tuitController.findTuitsByUser);
            app.get("/tuits/:tid", TuitController.tuitController.findTuitById);
            app.post("/tuits", TuitController.tuitController.createTuit);
            app.put("/tuits/:tid", TuitController.tuitController.updateTuit);
            app.delete("/tuits/:tid", TuitController.tuitController.deleteTuit);
        }
        return TuitController.tuitController;
    }

    private constructor() {}

    //retrieves all tuits from database
    findAllTuits = (req: Request, res: Response) =>
        this.tuitDao.findAllTuits()
            .then(tuits => res.json(tuits));

    //retrieves tuit from database whose primary key is tid
    findTuitById = (req: Request, res: Response) =>
        this.tuitDao.findTuitById(req.params.tid)
            .then(tuit => res.json(tuit));

    //retrieves tuit from database posted by a user whose primary key is uid
    findTuitsByUser = (req: Request, res: Response) =>
        this.tuitDao.findTuitsByUser(req.params.uid)
            .then(tuits => res.json(tuits));

    //parses tuit from HTTP body, inserts into database, responds with inserted user
    createTuit = (req: Request, res: Response) =>
        this.tuitDao.createTuit(req.body)
            .then(tuit => res.json(tuit));

    //removes tuit from database whose primary key is tid
    deleteTuit = (req: Request, res: Response) =>
        this.tuitDao.deleteTuit(req.params.tid)
            .then(status => res.json(status));

    //parses tuit updates from HTTP body, updates tuit in database whose primary key is tid
    updateTuit = (req: Request, res: Response) =>
        this.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status));


}