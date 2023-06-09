import http from 'http';
import express from 'express'
import { Server } from 'socket.io';
import amqp from 'amqplib/callback_api.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import config from './server-config.json' assert {type: 'json'};
import { readToken, verifyToken } from './security/tokens.mjs';
import { getPosts } from './services/postServices.mjs';

dotenv.config();

const DB_URI = process.env["MONGODB_URI_DATABASE"];
const port = config.listen_provider_port

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

await mongoose.connect(DB_URI).then((v) => {
    console.log("Conexión a la base de datos exitosa")
}).catch((err) => {
    console.log("Error en la conexión a la base de datos");
    console.error(err)
})


io.on('connection', (socket) => {

    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) {
            console.error("No se ha podido establecer conexión con el broker")
            console.error(err)
            return;
        }

        conn.createChannel((errar, channel) => {
            if (errar) {
                console.log("No se ha podido crear un Canal para el broker");
                console.error(errar);
                return;
            }

            const requestQueue = 'PUSH';
            const responseQueue = 'PULL';

            channel.assertQueue(requestQueue);
            channel.assertQueue(responseQueue)

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
                    username: tokenInfo.name,
                    name: tokenInfo.owner,
                    avatar: tokenInfo.avatar,
                    media: dat.media,
                    caption: dat.caption
                }

                channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(postData)))
                io.to(socket.id).emit("Log", {
                    status: true,
                    data: {
                        message: "Publicación añadida a cola con éxito"
                    }
                })
            })

            socket.on("GETALL", async (dat) => {
                if (!verifyToken(dat.token)) {
                    socket.emit("Log", {
                        status: false,
                        data: {
                            message: "Token inválido"
                        }
                    })
                    return;
                }

                const records = await getPosts();

                socket.emit("Posts", records)
            })

            channel.consume(responseQueue, (message) => {
                const data = JSON.parse(message.content.toString())
                io.emit("Feed", data)
            }, { noAck: true })

        })
    })

})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})