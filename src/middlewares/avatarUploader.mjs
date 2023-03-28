import multer from 'multer'
import ms3 from 'multer-s3'
import AWS from 'aws-sdk'

const AWS_REGION = process.env["AWS_REGION"];
const AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"];
const AWS_SECRET_KEY = process.env["AWS_SECRET_KEY"];
const BUCKET_NAME = process.env["BUCKET_NAME"];


const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
})

export const uploadAvatar = multer({
    storage: ms3({
        s3: s3,
        bucket: BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null,"avatars/"+ Date.now().toString() + "-" + file.originalname);
        },
        contentType: function (req, file, cb) {
            cb(null, file.mimetype)
        },
    })
});

