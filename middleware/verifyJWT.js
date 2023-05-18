const jwt = require('jsonwebtoken')
const People = require('../models/peopleModel')

const verifyJWT = async (req, res, next) => {
    console.log(req.cookies)
    const { jwt: jwtToken } = req.cookies
    // const authHeader = req.headers.authorization || req.headers.Authorization
    // const jwtToken = authHeader.split(' ')[1]
    // || !authHeader.startsWith('Bearer')
    if (!jwtToken)
        return res
            .status(404)
            .json({ success: false, message: `No token provided` })

    const verified = jwt.verify(jwtToken, 'secret')
    if (!verified)
        return res.status(403).json({ success: false, message: `Unauthorized` })

    const user = await People.findOne({ email: verified.email })
    if (!user)
        return res.status(404).json({ success: false, message: `No user` })
    req.user = user
    next()
}

module.exports = verifyJWT

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
