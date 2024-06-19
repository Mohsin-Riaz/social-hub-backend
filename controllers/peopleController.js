const People = require('../models/peopleModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
///////////////////////////////////////////////////////////////////////////////////////////////////

const getPeople = async (req, res) => {
    const personFound = await People.find({}).lean().exec();

    if (!personFound?.length)
        return res
            .status(404)
            .json({ success: false, message: `No people found` });

    return res.status(201).json({ success: true, data: personFound });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const getPeopleById = async (req, res) => {
    const { peopleId } = req.user || req.params;

    if (!peopleId)
        return res.status(400).json({ success: false, message: `Id required` });

    const personFound = await People.findOne({ peopleId: peopleId })
        .select('-password')
        .lean()
        .exec();

    if (!personFound)
        return res
            .status(400)
            .json({ success: false, message: `No person with ID found` });

    return res.status(201).json({
        success: true,
        data: personFound,
    });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const createPeople = async (req, res, next) => {
    const newPeopleData = req.body;
    if (!newPeopleData)
        return res
            .status(400)
            .json({ success: false, message: `No new data provided` });

    const duplicate = await People.findOne({ email: newPeopleData.email });

    if (duplicate) {
        return res
            .status(400)
            .json({ success: false, message: `Email already in use` });
    }

    if (newPeopleData?.password) {
        var hashedPassword = await bcrypt.hash(newPeopleData.password, 10);
    }

    if (newPeopleData.avatar !== 'default')
        newPeopleData.avatar = process.env.AWS_S3_URL + peopleId;
    else newPeopleData.avatar = undefined;

    const peopleId = crypto.randomUUID();
    const newPerson = await People.create({
        ...newPeopleData,
        peopleId: peopleId,
        password: hashedPassword,
        // avatar:  process.env.AWS_S3_URL + peopleId,
    });
    const personCreated = await newPerson.save();

    if (!personCreated)
        return res
            .status(406)
            .json({ success: false, message: `Person not created` });

    //res.status(201).json({ success: true, message: personCreated })

    next();
};

const createPeopleGoogle = async (req, res, next) => {
    const newUser = req.body;

    if (!newUser)
        return res
            .status(400)
            .json({ success: false, message: `No new data provided` });

    const duplicate = await People.findOne({ email: newUser.email });

    if (!duplicate) {
        const peopleId = crypto.randomUUID();
        const newPerson = await People.create({
            ...newUser,
            peopleId: peopleId,
            // avatar: process.env.IMAGE_BACKEND_URL + peopleId,
        });
        const personCreated = await newPerson.save();

        if (!personCreated)
            return res
                .status(406)
                .json({ success: false, message: `Person not created` });
    }
    next();
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const updatePeople = async (req, res) => {
    const newData = req.body;
    const { peopleId } = req.params;
    if (req.user?.peopleId != peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized` });

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

    if (!newData || req.user)
        return res
            .status(400)
            .json({ success: false, message: `No new data provided` });

    if (newData?.password) {
        var hashedPassword = await bcrypt.hash(newData.password, 10);
    }

    const updatedInfo = new Object({
        ...newData,
        password: hashedPassword,
    });

    const personUpdated = await People.findOneAndUpdate(
        { peopleId: req.user.peopleId },
        { ...updatedInfo },
        { returnDocument: 'after' }
    );

    if (!personUpdated)
        return res
            .status(400)
            .json({ success: false, message: `Person not updated` });

    return res.status(200).json({ success: true, data: personUpdated });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const deletePeople = async (req, res) => {
    const { peopleId } = req.params;
    if (req.user?.peopleId != peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized` });

    if (!peopleId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` });

    const personDeleted = await People.findOneAndDelete({ peopleId: peopleId });
    if (!personDeleted)
        return res
            .status(400)
            .json({ success: false, message: `Person not deleted` });

    return res.status(200).json({ success: true, message: `Person deleted` });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const addFriend = async (req, res) => {
    const { peopleId } = req.params;
    const newFriend = req.body;

    if (req.user.peopleId !== peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized add` });

    const addedFriend = await People.findOneAndUpdate(
        { peopleId: peopleId },
        {
            $push: { friends: { ...newFriend } },
        },
        { returnDocument: 'after' }
    );

    if (!addedFriend)
        return res
            .status(400)
            .json({ success: false, message: `friend not added` });

    return res
        .status(201)
        .json({ success: true, message: `friend added`, data: newFriend });
};

const removeFriend = async (req, res) => {
    const { peopleId } = req.params;
    const { friendId } = req.body;

    if (req.user.peopleId !== peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized remove` });

    const removedFriend = await People.findOneAndUpdate(
        { peopleId: peopleId },
        {
            $pull: { friends: { peopleId: friendId } },
        },
        { returnDocument: 'after' }
    );

    if (!removedFriend)
        return res
            .status(400)
            .json({ success: false, message: `friend not removed` });

    return res.status(201).json({ success: true, message: `friend removed` });
};

module.exports = {
    getPeople,
    getPeopleById,
    createPeople,
    createPeopleGoogle,
    updatePeople,
    deletePeople,
    addFriend,
    removeFriend,
};
