/**
 * @file Server file
 */
import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
const app = express();

/*
//connect to local mongoDB database
mongoose.connect('mongodb://localhost:27017/tuiter');
 */

//connect to remote mongoDB database
//username: admin  password: admin
mongoose.connect('mongodb+srv://admin:admin@cluster0.wenpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connection.once("open", function(){
    console.log("Database connected successfully");
})



app.use(bodyParser.json())
app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})

//instantiate controllers
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);

const PORT = 4000;
app.listen(process.env.PORT || PORT);