import express from 'express';
import "reflect-metadata";
import { AppDataSource } from './data-source';
import router from './routes/user';


const app = express();
const port = 4000;

//middlewares
app.use(express.json());
app.use(router);


//connect to the db and server
AppDataSource.initialize().then(() => {
        console.log("DB CONNECTED...");
        app.listen(port, () => {
            console.log('Server started at port-', port);
        })
})