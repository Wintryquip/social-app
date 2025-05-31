const express = require("express")
const router = express.Router()
const { auth } = require("../controllers/userController")
const { createComment, editComment, likeComment, deleteComment} = require("../controllers/commentController")

router.post("/create", auth, createComment)
router.patch("/edit", auth, editComment)
router.post("/like", auth, likeComment)
router.delete("/delete", auth, deleteComment)

module.exports = router