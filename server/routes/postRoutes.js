const express = require("express")
const router = express.Router()
const { auth } = require("../controllers/userController")
const { createPost, showPosts, updatePost, likePost} = require("../controllers/postController")

router.get("/show", showPosts)
router.post("/create", auth, createPost)
router.patch("/update", auth, updatePost)
router.post("/like", auth, likePost)

module.exports = router