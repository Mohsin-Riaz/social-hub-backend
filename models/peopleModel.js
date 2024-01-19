const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema(
    {
        peopleId: {
            type: String,
            require: true,
        },
        first_name: {
            type: String,
            require: true,
        },
        last_name: {
            type: String,
            require: true,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
            default: './database/avatars/avi1.png',
        },
        email: {
            type: String,
            require: true,
        },
        address: {
            type: String,
        },
        birthdate: {
            type: Date,
        },
        friends: {
            type: Array,
        },
        issuer: {
            type: String,
            default: 'default',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('People', peopleSchema);
