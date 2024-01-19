const jwt = require('jsonwebtoken');
// const { getGoogleOAuthTokens, getGoogleUser } = require('./googleHandler')
const { default: axios } = require('axios');
const qs = require('querystring');
const People = require('../models/peopleModel');
const crypto = require('crypto');
const { log } = require('console');

async function getGoogleOAuthTokens({ code }) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.BACKEND_URL + '/api/auth/google',
        grant_type: 'authorization_code',
    };

    try {
        const res = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return res.data;
    } catch (error) {
        console.error(error, error.code);
        throw new Error(error.message);
    }
}

async function googleOauthHandler(req, res, next) {
    const { code } = req.query;
    try {
        var { id_token } = await getGoogleOAuthTokens({ code });

        var { email, picture, given_name, family_name } = jwt.decode(id_token);
        req.body = {
            email: email,
            first_name: given_name,
            last_name: family_name,
            issuer: 'google',
            // avatar: picture,
        };
    } catch (error) {
        console.log(error, `Failed to authorize Google User`);
        return res.redirect(process.env.FRONTEND_URL);
    }

    next();

    // const duplicate = await People.findOne({ email: email })
    // if (!duplicate?.peopleId) var peopleId = crypto.randomUUID()
    // if (!duplicate) {
    //     const newPerson = await People.create({
    //         ...{
    //             email: email,
    //             first_name: given_name,
    //             last_name: family_name,
    //             issuer: 'google',
    //         },
    //         peopleId: peopleId,
    //         avatar: process.env.IMAGE_BACKEND_URL + peopleId,
    //     })
    //     const personCreated = await newPerson.save()

    //     if (!personCreated)
    //         return res
    //             .status(406)
    //             .json({ success: false, message: `Person not created` })
    // }

    // const cookieObject = jwt.sign(
    //     {
    //         peopleId: peopleId,
    //         email: email,
    //     },
    //     'secret'
    // )
    // console.log('pre-cookie')
    // // res.clearCookie('jwt')
    // res.cookie('jwt', cookieObject, {
    //     // httpOnly: false, //Access by browser only
    //     secure: true, //https
    //     sameSite: 'None', //cross-site cookie
    //     maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    //     //domain: '.app.localhost:3000',
    // })
    // return res.redirect('http://localhost:3000')
}

module.exports = googleOauthHandler;
