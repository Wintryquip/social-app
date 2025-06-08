const express = require("express")
const router = express.Router()
const { signUpUser, signInUser, logoutUser, auth, searchUsers, userProfile, editUser, deleteUserProfilePic, followUser, deleteUser} = require("../controllers/userController")
const {User} = require("../models/user");

router.post("/register", signUpUser)
router.post("/login", signInUser)
router.get("/me", auth, (req, res) => {
    User.findOne({ login: req.user.login })
        .then(user => {
            if (!user) return res.status(404).send({ message: "User not found." });
            res.send({
                login: user.login,
                profilePic: user.profilePic || "/uploads/images/profile/default/default.png"
            });
        })
        .catch(() => res.status(500).send({ message: "Server error." }));
});
router.post("/logout", auth, logoutUser)
router.get("/search/:login", searchUsers)
router.get("/profile/:login", userProfile)
router.patch("/edit", auth, editUser)
router.post("/follow", auth, followUser)
router.patch("/picture", auth, deleteUserProfilePic)
router.delete("/delete", auth, deleteUser)

module.exports = router