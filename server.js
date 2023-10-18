require('dotenv').config();
const express = require('express');
const app = express();
// const chatApp = express();

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const appPORT = process.env.APPPORT || 5000;
// const chatAppPORT = process.env.CHATPORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            'http://mohsinriaz.ca/social-hub-frontend/',
            `${process.env.BACKEND_URL}`,
            `${process.env.FRONTEND_URL}`,
            `app.${process.env.FRONTEND_URL}`,
        ],
        allowCredentials: true,
        credentials: true,
        allowedHeaders: [
            'Access-Control-Allow-Headers',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'ACCESS-CONTROL-ALLOW-CREDENTIAL',
            'Access-Control-Allow-Headers',
            'Content-Type',
            'Set-Cookie',
            'Cookie',
            'cookie',
            'Authorization',
            'XMLHttpRequest',
            'X-Requested-With',
            'Accept',
        ],
        allowCredentials: true,
    })
);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.log(err);
    }
};
connectDB();

mongoose.connection.once('open', () => {
    console.log(`Connected to Mongo DB`);

    app.listen(appPORT, () => {
        console.log(`Server: App listening on port ${appPORT}`);
    });

    // chatApp.listen(chatAppPORT, () => {
    //     console.log(`Server: Chat listening on port ${chatAppPORT}`);
    // });
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

//Routes
app.use('/api/people', require('./routes/peopleRoute'));
app.use('/api/post', require('./routes/postRoute'));
app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;
