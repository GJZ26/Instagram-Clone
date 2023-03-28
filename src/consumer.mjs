import amqp from 'amqplib/callback_api.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { uploadImage } from './services/imagePostService.mjs';
import { savePost } from './services/postServices.mjs';

dotenv.config();

const DB_URI = process.env["MONGODB_URI_DATABASE"];

await mongoose.connect(DB_URI).then((v) => {
    console.log("Conexión a la base de datos exitosa")
}).catch((err) => {
    console.log("Error en la conexión a la base de datos");
    console.error(err)
})

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) {
        console.log("No se ha podido establecer conexión con el broker");
        console.error(err);
        return;
    }

    conn.createChannel((errar, channel) => {
        if (errar) {
            console.log("No se ha podido iniciar un nuevo canal");
            console.error(errar);
            return;
        }

        const requestQueue = "PUSH";
        const responseQueue = "PULL";

        channel.assertQueue(requestQueue);
        channel.assertQueue(responseQueue);

        channel.consume(requestQueue, async (dat) => {

            const info = JSON.parse(dat.content.toString())
            console.log(info)

            const imageURI = await uploadImage(info.media.data)
            const res = await savePost(info.username, info.name, info.avatar, imageURI, info.caption)

            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(res)))

        }, { noAck: true })

    })
})