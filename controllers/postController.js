const Post = require('../models/postModel');
const crypto = require('crypto');

///////////////////////////////////////////////////////////////////////////////////////////////////

const getPost = async (req, res) => {
    const postsFound = await Post.find({}).lean().exec();
    if (!postsFound)
        return res
            .status(404)
            .json({ success: false, message: `no posts found` });

    if (!postsFound?.length)
        return res
            .status(204)
            .json({ success: true, message: `user has no posts` });

    return res.status(200).json({ success: true, data: postsFound });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const getPostById = async (req, res) => {
    const { postId } = req.params;

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` });
    const postFound = await Post.findOne({ postId: postId });

    if (!postFound)
        return res
            .status(404)
            .json({ success: false, message: `No post found` });

    return res.status(200).json({ success: true, message: postFound });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const getPostByQuery = async (req, res) => {
    const params = req.query;
    if (!params)
        return res
            .status(400)
            .json({ success: false, message: `No people id provided` });

    const postsFound = await Post.find(params).lean().exec();
    if (!postsFound?.length)
        return res
            .status(204)
            .json({ success: true, message: `No posts found` });

    return res.status(200).json({ success: true, data: postsFound });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const createPost = async (req, res) => {
    const newPost = req.body;
    const { peopleId } = req.user;
    if (!newPost)
        return res
            .status(400)
            .json({ success: false, message: `No post info provided` });
    const postId = crypto.randomUUID();
    if (newPost.postImage) {
        var postImage = process.env.AWS_S3_URL + postId + '.webp';
    }
    const newPostObject = await Post.create({
        peopleId: peopleId,
        ...newPost,
        postId: postId,
        postImage: postImage,
    });
    const postCreated = await newPostObject.save();
    if (!postCreated)
        return res
            .status(400)
            .json({ success: false, message: `Post not created` });

    return res
        .status(200)
        .json({ success: true, message: `Post created`, data: newPostObject });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const updatePost = async (req, res) => {
    const updatePostData = req.body;
    const { postId } = req.params;
    const { peopleId } = req.user;

    if (!updatePostData)
        return res
            .status(400)
            .json({ success: false, message: `No post info provided` });
    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` });

    const foundPost = await Post.findOne({ postId: postId });
    if (foundPost?.peopleId != peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized` });

    const postUpdated = await Post.findOneAndUpdate(
        { postId: postId },
        updatePostData,
        { returnDocument: 'after' }
    );

    if (!postUpdated)
        return res.status(400).json({
            success: false,
            message: `Post not updated`,
        });

    return res.status(200).json({ success: true, message: `Post updated` });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { peopleId } = req.user;

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` });

    const foundPost = await Post.findOne({ postId: postId });
    if (foundPost?.peopleId != peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized` });

    const postDeleted = await Post.findOneAndDelete({ postId: postId });

    if (!postDeleted)
        return res
            .status(400)
            .json({ success: false, message: `Post not deleted` });

    return res.status(200).json({ success: true, message: 'Post Deleted' });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const postComment = async (req, res) => {
    const comment = req.body;
    const { postId } = req.params;
    const { peopleId } = req.user;

    if (comment.peopleId !== peopleId)
        return res
            .status(403)
            .json({ success: false, message: `Unauthorized post` });

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` });

    if (!comment)
        return res
            .status(400)
            .json({ success: false, message: `No post comment provided` });

    const postComment = {
        commentId: crypto.randomUUID(),
        dateCreated: new Date(),
        ...comment,
    };

    const postUpdated = await Post.findOneAndUpdate(
        { postId: postId },
        {
            $push: {
                postComments: postComment,
            },
        },
        { returnDocument: 'after' }
    );

    if (!postUpdated)
        return res.status(400).json({
            success: false,
            message: `Post not updated`,
        });

    return res
        .status(200)
        .json({ success: true, message: `Post updated`, data: postComment });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const likeComment = async (req, res) => {
    const { postId } = req.params;

    if (!postId)
        return res
            .status(400)
            .json({ success: false, message: `No post id provided` });

    const postLiked = await Post.findOneAndUpdate(
        { postId: postId },
        { $inc: { postLikes: 1 } },
        { returnDocument: 'after' }
    );

    if (!postLiked)
        return res.status(400).json({
            success: false,
            message: `Post wasn't liked`,
        });

    return res.status(200).json({ success: true, message: `Post liked` });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

const deleteComment = async (req, res) => {
    const { postId } = req.params;
    const { commentId } = req.body;
    const { peopleId } = req.user;

    if (!postId || !commentId)
        return res
            .status(400)
            .json({ success: false, message: `No id provided` });

    const updatedPostComments = await Post.findOneAndUpdate(
        { postId: postId },
        { $pull: { postComments: { commentId: commentId } } },
        { returnDocument: 'after' }
    );

    // const foundPost = await Post.findOne({ postId: postId })
    // const updatedComments = foundPost.postComments.filter((comment) => {
    //     if (comment.peopleId !== peopleId || comment.commentId !== commentId)
    //         return comment
    // })

    // if (updatedComments.length === foundPost.postComments.length)
    //     return res
    //         .status(404)
    //         .json({ success: false, message: `Comment not found` })

    // const updatedPostComments = await Post.findOneAndUpdate(
    //     { postId: postId },
    //     { postComments: updatedComments },
    //     { returnDocument: 'after' }
    // )

    if (!updatedPostComments)
        return res
            .status(400)
            .json({ success: false, message: `comment not deleted` });

    return res.status(200).json({ success: true, message: `Comment Deleted` });
};

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
    likeComment,
};
