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
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import LikeController from "./controllers/LikeController";
import FollowController from "./controllers/FollowController";
import BookmarkController from "./controllers/BookmarkController";
import MessageController from "./controllers/MessageController";
import AuthenticationController from "./controllers/AuthenticationController";
import DislikeController from "./controllers/DislikeController";

const socket = require("socket.io");
const cors = require('cors')
const session = require("express-session");

//read database username && password through process.env
const dotenv = require("dotenv")
dotenv.config()

/*
connect to local mongoDB database
mongoose.connect('mongodb://localhost:27017/tuiter');
 */

/*
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 *     +'@cluster0.wenpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 1
 */

/*
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.yzklt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 2
 */

/*
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.lyb73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 3
 */

/*
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.iylq3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 4
 */

/*
 *  mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 *       + '@cluster0.lhdzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for final project
 */
mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
     + '@cluster0.lhdzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connection.once("open", function(){
    console.log("Database connected successfully");
})

const app = express();

// cross network region
app.use(cors({
    // support cookie header
    credentials: true,
    // must whitelists allowed domains(if using credentials)
    // http://localhost:3000
    origin: ['http://localhost:3000', process.env.CORS_ORIGIN]
}));

const SECRET = 'process.env.SECRET';
//session configure
let sess = {
    secret: SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        // sameSite: none allows cookies to be sent in all contexts
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    }
}

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}

app.use(session(sess))
app.use(express.json())

app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})

//instantiate controllers
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likeController = LikeController.getInstance(app);
const dislikeController = DislikeController.getInstance(app)
const followController = FollowController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
const messageController = MessageController.getInstance(app);
AuthenticationController(app);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
const server = app.listen(process.env.PORT || PORT);

// create io, pass a http.Server instance to socket
const io = socket(server, {
    cors: {
        // support cookie header
        credentials: true,
        // must whitelists allowed domains(if using credentials)
        // http://localhost:3000
        origin: ['http://localhost:3000', process.env.CORS_ORIGIN]
    }
})

let onlineUsers = new Map();
// create connection with client
io.on("connection", (socket: any) => {

    let uid = '';
    //add online users
    socket.on("addUser", (userId: string) => {
        uid = userId
        onlineUsers.set(userId, socket.id);
    });

    // send message
    socket.on("sendMsg", (data: any) =>{
        // find receiver
        const receiverSocket = onlineUsers.get(data.sentTo);
        if(receiverSocket){
            // use socket to send received message to receiver
            socket.to(receiverSocket).emit("receiveMsg", data.message);
        }
    });

    //disconnect
    socket.on("disconnect", () => {
        //delete user
        onlineUsers.delete(uid);
    })

})