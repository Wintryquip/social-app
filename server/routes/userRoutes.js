const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, auth, userProfile, editUser, deleteUserProfilePic, followUser, deleteUser} = require("../controllers/userController")

router.post("/register", signUpUser)
router.post("/login", signInUser)
router.get("/profile", userProfile)
router.patch("/edit", auth, editUser)
router.post("/follow", auth, followUser)
router.patch("/picture", auth, deleteUserProfilePic)
router.delete("/delete", auth, deleteUser)

module.exports = router