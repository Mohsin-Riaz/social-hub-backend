const People = require('../models/peopleModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
///////////////////////////////////////////////////////////////////////////////////////////////////

const getPeople = async (req, res) => {
    const personFound = await People.find({}).lean().exec()

    if (!personFound?.length)
        return res
            .status(404)
            .json({ success: false, message: `No people found` })

    return res.status(201).json({ success: true, message: personFound })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const getPeopleById = async (req, res) => {
    const { peopleId } = req.params

    if (!peopleId)
        return res.status(400).json({ success: false, message: `Id required` })

    const personFound = await People.findOne({ peopleId: peopleId })
        .lean()
        .exec()

    if (!personFound)
        return res
            .status(400)
            .json({ success: false, message: `No product with ID found` })

    return res.status(201).json({
        success: true,
        data: personFound,
    })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const createPeople = async (req, res, next) => {
    const { newPeopleData } = req.body
    // const {
    //     first_name,
    //     last_name,
    //     password,
    //     email,
    //     avatar,
    //     address,
    //     birthdate,
    //     issuer,
    // } = newPeopleData

    if (!newPeopleData)
        return res
            .status(400)
            .json({ success: false, message: `No new data provided` })

    const duplicate = await People.findOne({ email: newPeopleData.email })

    if (duplicate)
        return res
            .status(400)
            .json({ success: false, message: `Email already in use` })

    if (newPeopleData?.password) {
        var hashedPassword = await bcrypt.hash(newPeopleData.password, 10)
    }

    const newPerson = await People.create({
        ...newPeopleData,
        peopleId: crypto.randomUUID(),
        password: hashedPassword,
    })
    const personCreated = await newPerson.save()

    if (!personCreated)
        return res
            .status(406)
            .json({ success: false, message: `Person not created` })

    //res.status(201).json({ success: true, message: personCreated })

    next()
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const updatePeople = async (req, res) => {
    const { updatePeopleData } = req.body
    const { peopleId } = req.params
    if (req.user?.peopleId != peopleId)
        return res.status(403).json({ success: false, message: `Unauthorized` })

    // const {
    //     first_name,
    //     last_name,
    //     password,
    //     email,
    //     avatar,
    //     address,
    //     birthdate,
    //     issuer,
    // } = updatePeopleData

    if (!updatePeopleData)
        return res
            .status(400)
            .json({ success: false, message: `No new data provided` })

    if (updatePeopleData?.password) {
        var hashedPassword = await bcrypt.hash(updatePeopleData.password, 10)
    }

    const updatedInfo = new Object({
        ...updatePeopleData,
        password: hashedPassword,
    })

    const personUpdated = await People.findOneAndUpdate(
        { peopleId: peopleId },
        { ...updatedInfo },
        { returnDocument: 'after' }
    )

    if (!personUpdated)
        return res
            .status(400)
            .json({ success: false, message: `Person not updated` })

    return res.status(200).json({ success: true, message: personUpdated })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const deletePeople = async (req, res) => {
    const { peopleId } = req.params
    if (req.user?.peopleId != peopleId)
        return res.status(403).json({ success: false, message: `Unauthorized` })

    if (!peopleId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` })

    const personDeleted = await People.findOneAndDelete({ peopleId: peopleId })
    if (!personDeleted)
        return res
            .status(400)
            .json({ success: false, message: `Person not deleted` })

    return res.status(200).json({ success: true, message: `Person deleted` })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    getPeople,
    getPeopleById,
    createPeople,
    updatePeople,
    deletePeople,
}
