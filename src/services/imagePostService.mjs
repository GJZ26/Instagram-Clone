import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config()

const AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"];
const AWS_SECRET_KEY = process.env["AWS_SECRET_KEY"];
const BUCKET_NAME = process.env["BUCKET_NAME"];

console.log(BUCKET_NAME)

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
});

export const uploadImage = async (file) => {
    const fileParsed = new Buffer.from(file)
    let response;

    await s3.upload({
        Bucket: BUCKET_NAME,
        Key: "media/" + Date.now() + ".jpg",
        Body: fileParsed,
        ContentType: "image/jpg"
    }).promise()
        .then((dat) => {
            response = dat.Location
        })
        .catch((e) => {
            console.log("Ha ocurrido un error durante el guardado de la imagen"); console.error(e)
        })

    return response
}