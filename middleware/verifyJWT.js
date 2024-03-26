const jwt = require('jsonwebtoken');
const People = require('../models/peopleModel');

const verifyJWT = async (req, res, next) => {
    const { jwt: jwtToken } = req.cookies;
    const { googleJWT } = req.query;

    if (!jwtToken && !googleJWT?.length)
        return res
            .status(400)
            .json({ success: false, message: `No token provided` });

    if (jwtToken) {
        const verifiedCookie = jwt.verify(jwtToken, 'secret');
        if (!verifiedCookie)
            return res
                .status(403)
                .json({ success: false, message: `Unauthorized` });
        var userFound = await People.findOne({ email: verifiedCookie.email });
    } else if (googleJWT.length) {
        try {
            const verifiedGoogle = jwt.verify(googleJWT, 'secret');
            if (!verifiedGoogle)
                return res
                    .status(403)
                    .json({ success: false, message: `Unauthorized` });
            var userFound = await People.findOne({
                email: verifiedGoogle.email,
            });
        } catch (error) {
            console.log(error);
        }
    }

    if (!userFound)
        return res.status(404).json({ success: false, message: `No user` });

    req.user = userFound;
    next();
};

module.exports = verifyJWT;
// const authHeader = req.headers.authorization || req.headers.Authorization
// const jwtToken = authHeader.split(' ')[1]
// || !authHeader.startsWith('Bearer')

// const jwt = require('jsonwebtoken')
// require('dotenv').config()

// const jwtVerify = (req, res, next) => {
//     const authHeader = req.headers.Authorization || req.headers.authorization

//     if (!authHeader?.startsWith('Bearer ')) {
//         return res.status(401).json({ success: false, message: `Unauthorized` })
//     }

//     const token = authHeader.split(' ')[1]

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res
//                 .status(403)
//                 .json({ success: false, message: `Forbidden`, err: err })
//         }

//         req.user = decoded.username
//         next()
//     })
// }

// module.exports = jwtVerify
