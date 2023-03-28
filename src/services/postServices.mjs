import { PostModel } from "../models/postModel.mjs";
import { sendNotification } from "./notificationServices.mjs";

export const savePost = async (username, name, avatar, media, caption) => {
    const record = new PostModel();
    let response;

    record.username = username;
    record.name = name;
    record.avatar = avatar;
    record.media = media;
    record.caption = caption;

    await record.save().then((v) => {
        response = {
            status: true,
            data: {
                message: "Nueva publicación",
                attributes: v
            }
        }
    }).catch((err) => {
        response = {
            status: false,
            data: {
                errno: 3,
                message: "No se ha podido completar el registro a la base de datos",
                datails: err
            }
        }
    })

    sendNotification(`¡${username} acaba de publicar una nueva foto! Sé el primero en verla a través en Ig Clone`, `Nuevo post de ${username}`)
    return response
}

export const getPosts = async () => {
    let response;

    await PostModel.find({}).then((v) => {
        response = {
            status: true,
            data: {
                message: "Lista de publicaciones recuperada",
                records: v
            }
        }
    }).catch((err) => {
        response = {
            status: false,
            data: {
                errno: 4,
                message: "Ha ocurrido un error al momento de recuperar los datos de la base de datos"
            }
        }
    })
    return response
}