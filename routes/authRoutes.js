const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const router = express.Router()
const {
    login,
    loginGoogle,
    logout,
    refreshJwt,
} = require('../controllers/authController')
const googleOauthHandler = require('../controllers/googleController.js')
const { createPeopleGoogle } = require('../controllers/peopleController')

router.route('/login').post(login)
router.route('/refresh').post(refreshJwt)
router.route('/logout').post(logout)
router.route('/google').get(googleOauthHandler)

module.exports = router
