import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: new Date()
    }
});

export const PostModel = mongoose.model('posts', postSchema)