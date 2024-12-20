import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import router from "./routes/user";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from 'express-session';

const app = express();
const port = 4000;

//only accept the request from given origin
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true  //to send and receive cookies
};

//middlewares
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(router);

//connect to the db and server
AppDataSource.initialize()
  .then(() => {
    console.log("DB CONNECTED...");
    app.listen(port, () => {
      console.log("Server started at port-", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  }); 
