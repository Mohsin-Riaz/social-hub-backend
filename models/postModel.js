const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        peopleId: {
            type: String,
            require: true,
        },
        avatar: {
            type: String,
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        postId: {
            type: String,
            require: true,
        },
        postImage: {
            type: String,
        },
        postTitle: {
            type: String,
        },
        postText: {
            type: String,
        },
        postLikes: {
            type: Number,
            default: 0,
        },
        postComments: {
            type: Array,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
