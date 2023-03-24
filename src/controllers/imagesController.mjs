import multer from 'multer';
import AWS from 'aws-sdk';
import multers3 from 'multer-s3'

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;

const s3 = new AWS.S3({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });


export const fileUpload = multer({
    storage: multers3({
        s3: s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const ext = file.mimetype.split("/")[1]
            cb(null, Date.now().toString() + "-" + "igClone."+ext)
        },
        contentType: function(req,file,cb){
            cb(null, file.mimetype)
        }
    })
}).single("avatar")