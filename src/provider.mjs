import http from 'http';
import express from 'express'
import { Server } from 'socket.io';
import dotev from 'dotenv'

import config from './server-config.json' assert {type: 'json'};
import { readToken, verifyToken } from './security/tokens.mjs';

const port = config.listen_provider_port

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

dotev.config()


io.on('connection', (socket) => {
    console.log("Client Connected")

    socket.on("POST", (dat) => {
        if (!verifyToken(dat.token)) {
            socket.emit("Log", {
                status: false,
                data: {
                    errno: 1,
                    message: "Token inválido o expirado"
                }
            })
            return;
        }

        if (dat.media === undefined) {
            socket.emit("Log", {
                status: false,
                data: {
                    errno: 2,
                    message: "No se ha adjuntado imagen"
                }
            })
            return;
        }

        const tokenInfo = readToken(dat.token)

        const postData = {
            author: tokenInfo.name,
            avatar: tokenInfo.avatar,
            date: new Date(),
            media: dat.media,
            caption: dat.caption
        }
        console.log(postData)
    })
})

io.on("POST", (dat) => {
    console.log(dat)
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})