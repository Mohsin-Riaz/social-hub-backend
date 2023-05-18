const express = require('express')
const router = express.Router()
const {
    getPeople,
    createPeople,
    updatePeople,
    deletePeople,
    getPeopleById,
} = require('../controllers/peopleController')
const verifyJWT = require('../middleware/verifyJWT')
const { login } = require('../controllers/authController')

router.route('/').get(getPeople)
router.route('/').post(createPeople, login)

router.route('/:peopleId').get(getPeopleById)
router.use(verifyJWT).route('/:peopleId').patch(updatePeople)
router.route('/:peopleId').delete(verifyJWT, deletePeople)

module.exports = router
