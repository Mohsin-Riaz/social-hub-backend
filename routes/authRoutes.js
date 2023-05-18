const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const router = express.Router()
const { login, logout, refreshJwt } = require('../controllers/authController')

router.route('/login').post(login)
router.route('/refresh').post(refreshJwt)
router.route('/logout').post(logout)

module.exports = router
