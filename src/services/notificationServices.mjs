import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"];
const AWS_SECRET_KEY = process.env["AWS_SECRET_KEY"];
const AWS_REGION = process.env["AWS_REGION"];
const TOPIC_ARN = process.env["TOPIC_ARN"];

const sns = new AWS.SNS({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
})

export const SNSsuscribe = (email) => {

    sns.subscribe({
        Protocol: 'EMAIL',
        TopicArn: TOPIC_ARN,
        Endpoint: email
    }, (err, dat) => {
        if (err) {
            console.log(err);
            return;
        }
    })

}

export const sendNotification = (message, subject) => {
    sns.publish({
        Message: message,
        Subject: subject,
        TopicArn: TOPIC_ARN
    }, (err, dat) => {
        if (err) {
            console.log(err);
            return;
        }
    })
}