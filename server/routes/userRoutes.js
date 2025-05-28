const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, auth, userProfile, editUser, deleteUser} = require("../controllers/userController")

router.post("/register", signUpUser)
router.post("/login", signInUser)
router.get("/profile", auth, userProfile)
router.post("/edit", auth, editUser)
router.delete("/delete", auth, deleteUser)

module.exports = router