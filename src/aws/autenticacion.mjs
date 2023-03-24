import AWS from 'aws-sdk';
import fs from "fs";

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;

const s3 = new AWS.S3({accessKeyId:accessKeyId, secretAccessKey:secretAccessKey});
const bucketParams = {
    Bucket: bucketName,
  };
s3.createBucket(bucketParams, function(err, data){
    if(err) console.log("error", err)
    else console.log("success", data.Buckets)
});

var signatures = {
    png: {mime:"image/png",ext:"png"},
    jpg: {mime:"image/jpg",ext:"jpg"},
    jpeg: {mime:"image/jpeg",ext:"jpeg"}
  };
  
  /**
   * 
   * @param {String} b64 
   */
  function detectMimeType(b64) {
    console.log("aAAa")
    if(b64.includes(signatures.jpg["mime"])) return signatures.jpg
    if(b64.includes(signatures.jpeg["mime"])) return signatures.jpeg
    if(b64.includes(signatures.png["mime"])) return signatures.png
  }

/**
 * 
 * @param {Blob} filePath 
 * @param {*} bucketName 
 * @param {*} keyName 
 */



export const uploadFile = (filePath) => {
    if (!filePath) return
    // const imagen = fs.readFileSync(filePath, {encoding:'base64'})
    const tp = detectMimeType(filePath)
    console.log("BbBBbB");
    console.table(tp)
    const ky = Date.now()

    const encoder = new TextEncoder();
    const uin = encoder.encode(filePath)
    const bff = uin.buffer;

    console.log(bff)
    const imagen = Buffer.from(bff,'base64')
    fs.writeFileSync(ky+"."+tp.ext,imagen)

    const uploadParams = {
      Bucket: bucketName, 
      Key: ky+"."+tp.ext,
      Body: imagen, 
      ContentType: tp.mime
    }
    s3.putObject(uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
        }
        if (data) {
          console.log("Upload Success", data);
        }
      });
}


