import { PostModel } from "../models/postModel.mjs";

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

    return response
}

export const getPosts = async () => {
    let response;

    await PostModel.find({}, (err, records) => {
        if (err) {
            response = {
                status: false,
                data: {
                    errno: 4,
                    message: "Ha ocurrido un error al momento de recuperar los datos de la base de datos"
                }
            }
        } else {
            response = {
                status: true,
                data: {
                    message: "Lista de publicaciones recuperada",
                    records: records
                }
            }
        }
    })

    return response
}