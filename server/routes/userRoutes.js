const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, logoutUser, auth, userProfile, editUser, deleteUserProfilePic, followUser, deleteUser} = require("../controllers/userController")

router.post("/register", signUpUser)
router.post("/login", signInUser)
router.post("/logout", logoutUser)
router.get("/profile", userProfile)
router.patch("/edit", auth, editUser)
router.post("/follow", auth, followUser)
router.patch("/picture", auth, deleteUserProfilePic)
router.delete("/delete", auth, deleteUser)

module.exports = router