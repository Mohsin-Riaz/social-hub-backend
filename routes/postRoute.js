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
} = require('../controllers/postController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/').get(getPost)
router.route('/').post(verifyJWT, createPost)

router.route('/p/:postId').get(getPostById)
router.route('/pid/').get(getPostByQuery)
// router.use(verifyJWT)
router.route('/:postId').patch(verifyJWT, updatePost)
router.route('/:postId').delete(verifyJWT, deletePost)

//--COMMENT-ROUTES--
router.use(verifyJWT).route('/dc/:postId').delete(deleteComment)
router.use(verifyJWT).route('/pc/:postId').patch(postComment)

module.exports = router
