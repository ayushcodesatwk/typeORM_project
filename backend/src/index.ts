import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import router from "./routes/user";
import cors from "cors";

const app = express();
const port = 4000;

//only accept the request from given origin
const corsOptions = {
  origin: ["http://localhost:5173"],
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
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
