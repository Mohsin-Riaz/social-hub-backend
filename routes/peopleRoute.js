const express = require('express')
const router = express.Router()
const {
    getPeople,
    createPeople,
    updatePeople,
    deletePeople,
    getPeopleById,
    addFriend,
    removeFriend,
} = require('../controllers/peopleController')
const verifyJWT = require('../middleware/verifyJWT')
const { login } = require('../controllers/authController')

router.route('/getall/').get(getPeople)
router.route('/createpeople/').post(createPeople, login)

router.route('/getpeoplebyid/:peopleId').get(getPeopleById)
router.route('/getuser/').get(verifyJWT, getPeopleById)
router.route('/updatepeople/:peopleId').patch(verifyJWT, updatePeople)
router.route('/deletepeople/:peopleId').delete(verifyJWT, deletePeople)

router.route('/addfriend/:peopleId').patch(verifyJWT, addFriend)
router.route('/removefriend/:peopleId').patch(verifyJWT, removeFriend)

//ADMIN ROUTES
router
    .route('/admin/')
    .get(getPeopleById)
    .post(createPeople)
    .patch(updatePeople)
    .delete(deletePeople)

module.exports = router
