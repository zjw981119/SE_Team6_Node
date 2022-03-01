/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>follows</li>
 *     <li>bookmarks</li>
 *     <li>messages</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import LikeController from "./controllers/LikeController";
import FollowController from "./controllers/FollowController";
import BookmarkController from "./controllers/BookmarkController";
import MessageController from "./controllers/MessageController";
var cors = require('cors')

//read database username && password through process.env
const dotenv = require("dotenv")
dotenv.config()

/*
connect to local mongoDB database
mongoose.connect('mongodb://localhost:27017/tuiter');
 */

/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 *     +'@cluster0.wenpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 1
 */

/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.yzklt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 2
 */

/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.lyb73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 3
 */
mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
     + '@cluster0.lyb73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connection.once("open", function(){
    console.log("Database connected successfully");
})


const app = express();
app.use(express.json())
//cross network domain
app.use(cors())
app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})

//instantiate controllers
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likeController = LikeController.getInstance(app);
const followController = FollowController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
const messageController = MessageController.getInstance(app);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);