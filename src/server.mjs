import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors'

import config from './server-config.json' assert {type:'json'};

import { greetingRouter } from "./routers/greetingRoute.mjs";
import { authRouter } from "./routers/authRoutes.mjs";

dotenv.config();

const PORT = config.listen_port;

const app = express();

app.use(express.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({extended:false,limit: '25mb'}));
app.use(cors())

app.use(greetingRouter);
app.use("/auth",authRouter);

const server = app.listen(PORT,()=>{
    console.log("Server setting up!");
    console.log(`${server.address().address}:${server.address().port}`);
})