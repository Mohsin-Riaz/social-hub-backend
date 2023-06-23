const express = require('express')
const router = express.Router()
const {
    getPost,
    createPost,
    getPostByQuery,
    updatePost,
    deletePost,
    getPostById,
    deleteComment,
    postComment,
    likeComment,
} = require('../controllers/postController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/').get(getPost)
router.route('/').post(verifyJWT, createPost)

router.route('/p/:postId').get(getPostById)
router.route('/pid/').get(getPostByQuery)
router.route('/likepost/:postId').patch(likeComment)
router.route('/updatepost/:postId').patch(verifyJWT, updatePost)
router.route('/deletepost/:postId').delete(verifyJWT, deletePost)

//--COMMENT-ROUTES--
router.use(verifyJWT).route('/dc/:postId').delete(verifyJWT, deleteComment)
router.use(verifyJWT).route('/pc/:postId').patch(verifyJWT, postComment)

//ADMIN ROUTES
router
    .route('/admin/post/')
    .post(createPost)
    .patch(updatePost)
    .delete(deletePost)

router.route('/admin/comment/').patch(postComment).delete(deleteComment)

module.exports = router
