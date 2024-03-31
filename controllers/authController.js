const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const People = require('../models/peopleModel');

const login = async (req, res) => {
    const { email, password } = req.body.newPeopleData || req.body;

    if (!email || !password)
        return res
            .status(404)
            .json({ success: false, message: `no email/password provided` });

    const personFound = await People.findOne({ email: email });
    if (!personFound)
        return res
            .status(404)
            .json({ success: false, message: `person does not exist` });

    const personVerified = await bcrypt.compare(password, personFound.password);
    if (!personVerified)
        return res
            .status(403)
            .json({ success: false, message: `Not authenticated` });

    const cookieObject = jwt.sign(
        {
            peopleId: personFound.peopleId,
            email: personFound.email,
        },
        'secret'
    );
    res.clearCookie('jwt');
    res.cookie('jwt', cookieObject, {
        httpOnly: true, //Access by browser only
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        // sameSite: 'Lax', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        path: '/', //    '/social-hub-frontend'
        //domain: '.app.localhost:3000',
    });

    return res.status(200).json({
        success: true,
        message: 'Person logged in',
        data: { peopleId: personFound.peopleId },
        // cookieObject: cookieObject,
    });
    // return res.redirect(process.env.FRONTEND_URL);
};

const loginGoogle = async (req, res) => {
    const { email } = req.body;

    if (!email)
        return res
            .status(404)
            .json({ success: false, message: `no email/password provided` });

    const personFound = await People.findOne({ email: email });
    if (!personFound)
        return res
            .status(404)
            .json({ success: false, message: `person does not exist` });

    const cookieObject = jwt.sign(
        {
            peopleId: personFound.peopleId,
            email: personFound.email,
        },
        'secret'
    );
    res.clearCookie('jwt');
    res.cookie('jwt', cookieObject, {
        httpOnly: true, //Access by browser only
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        // sameSite: 'Lax', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        path: '/', //    '/social-hub-frontend'
        //domain: '.app.localhost:3000',
    });

    return res.redirect(`${process.env.FRONTEND_URL}?jwt=${cookieObject}`);
};

const logout = async (req, res) => {
    return res
        .clearCookie('jwt')
        .status(200)
        .json({ success: true, message: 'Logged out' });
};

const refreshJwt = async (req, res) => {
    const { peopleId, email } = req.user;

    const cookieObject = jwt.sign(
        {
            peopleId: peopleId,
            email: email,
        },
        'secret'
    );
    res.clearCookie('jwt').cookie('jwt', cookieObject, {
        maxAge: 1000 * 60 * 60 * 24,
    });
};

module.exports = { login, loginGoogle, logout, refreshJwt };
