const Post = require('../models/postModel')
const crypto = require('crypto')

const getPost = async (req, res) => {
    const postsFound = await Post.find({}).lean().exec()

    if (!postsFound?.length)
        return res
            .status(400)
            .json({ success: false, message: `No posts found` })

    return res.status(200).json({ success: true, message: postsFound })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const getPostById = async (req, res) => {
    const { postId } = req.params

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` })
    const postFound = await Post.findOne({ postId: postId })

    if (!postFound)
        return res
            .status(400)
            .json({ success: false, message: `No post found` })

    return res.status(200).json({ success: true, message: postFound })
}
///////////////////////////////////////////////////////////////////////////////////////////////////
const getPostByQuery = async (req, res) => {
    const params = req.query
    if (!params)
        return res
            .status(400)
            .json({ success: false, message: `No people id provided` })

    const postsFound = await Post.find({ ...params })
        .lean()
        .exec()

    if (!postsFound?.length)
        return res
            .status(404)
            .json({ success: false, message: `No posts found` })

    return res.status(200).json({ success: true, message: postsFound })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const createPost = async (req, res) => {
    const { newPost } = req.body
    const { peopleId } = req.user
    if (!newPost)
        return res
            .status(400)
            .json({ success: false, message: `No post info provided` })

    const newPostObject = await Post.create({
        peopleId: peopleId,
        ...newPost,
        postId: crypto.randomUUID(),
    })
    const postCreated = await newPostObject.save()

    if (!postCreated)
        return res
            .status(400)
            .json({ success: false, message: `Post not created` })

    return res.status(200).json({ success: true, message: `Post created` })
}
///////////////////////////////////////////////////////////////////////////////////////////////////

const updatePost = async (req, res) => {
    const { updatePostData } = req.body
    const { postId } = req.params
    const { peopleId } = req.user

    if (!updatePostData)
        return res
            .status(400)
            .json({ success: false, message: `No post info provided` })
    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` })

    const foundPost = await Post.findOne({ postId: postId })
    if (foundPost?.peopleId != peopleId)
        return res.status(403).json({ success: false, message: `Unauthorized` })

    const postUpdated = await Post.findOneAndUpdate(
        { postId: postId },
        {
            ...updatePostData,
        },
        { returnDocument: 'after' }
    )

    if (!postUpdated)
        return res.status(400).json({
            success: false,
            message: `Post not updated`,
        })

    return res.status(200).json({ success: true, message: `Post updated` })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const postComment = async (req, res) => {
    const { commentText } = req.body
    const { postId } = req.params
    const { peopleId } = req.user
    console.log(postComment, postId, peopleId)
    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` })
    if (!postComment)
        return res
            .status(400)
            .json({ success: false, message: `No post comment provided` })

    const postUpdated = await Post.findOneAndUpdate(
        { postId: postId },
        {
            $push: {
                postComments: {
                    commentId: crypto.randomUUID(),
                    peopleId: peopleId,
                    commentText: commentText,
                    dateCreated: new Date(),
                },
            },
        },
        { returnDocument: 'after' }
    )

    if (!postUpdated)
        return res
            .status(400)
            .json({ success: false, message: `Post not updated` })

    return res.status(200).json({ success: true, message: `Post updated` })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const deletePost = async (req, res) => {
    const { postId } = req.params
    const { peopleId } = req.user

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` })

    const foundPost = await Post.findOne({ postId: postId })
    if (foundPost?.peopleId != peopleId)
        return res.status(403).json({ success: false, message: `Unauthorized` })

    const postDeleted = await Post.findOneAndDelete({ postId: postId })

    if (!postDeleted)
        return res
            .status(400)
            .json({ success: false, message: `Post not deleted` })

    return res.status(200).json({ success: true, message: postDeleted })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const deleteComment = async (req, res) => {
    const { postId } = req.params
    const { commentId } = req.body
    const { peopleId } = req.user

    if (!postId || !commentId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` })

    const commentDeleted = await Post.findOne({ postId: postId })
        .then((post) => {
            const postComments = post.postComments
            return postComments.filter((comment) => {
                if (
                    comment.peopleId !== peopleId ||
                    comment.commentId !== commentId
                )
                    return comment
            })
        })
        .then((updatedPostComments) => {
            return Post.findOneAndUpdate(
                { postId: postId },
                { postComments: updatedPostComments },
                { returnDocument: 'after' }
            )
        })

    if (!commentDeleted)
        return res
            .status(400)
            .json({ success: false, message: `comment not deleted` })

    return res.status(200).json({ success: true, message: commentDeleted })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    getPost,
    getPostByQuery,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    deleteComment,
    postComment,
}
