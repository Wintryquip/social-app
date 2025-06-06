const {validate, User} = require("../models/user")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const fs = require("fs")
const path = require("path")
const { sendNotification } = require("./notificationController");
const {Post} = require("../models/post");
const {Comment} = require("../models/comment");
const {mongo} = require("mongoose");

/*
    Function saving user data in the database.
    Password is being hashed before save.
 */
const signUpUser = async (req, res) => {
    try {
        const {error} = validate(req.body)
        if(error)
            return res.status(400).send({message: error.details[0].message})
        const normalizedLogin = req.body.login.trim().toLowerCase();
        const user = await User.findOne({ login: normalizedLogin })
        if(user)
            return res
                .status(409)
                .send({ message: "User with given login address already exists!"})
        const normalizedEmail = req.body.email.trim().toLowerCase();
        const checkEmailUser = await User.findOne({ email: normalizedEmail })
        if(checkEmailUser)
            return res
                .status(409)
                .send({message: "User with given email already exists!"})
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, login: normalizedLogin, email: normalizedEmail, password: hashPassword }).save()
        res.status(201).send( { message: "User created successfully." })
        console.log(new Date(), "User", normalizedLogin, "registered in the database.")
    } catch (error) {
        console.error(new Date(), "Error registering user:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function that logs in user to the system.
 */
const signInUser = async (req, res) => {
    const validate = (data) => {
        const schema = Joi.object({
            login: Joi.string().required().label("Login"),
            password: Joi.string().required().label("Password"),
        })
        return schema.validate(data)
    }
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        const normalizedLogin = req.body.login.toLowerCase();
        const user = await User.findOne({ login: normalizedLogin })
        if (!user)
            return res.status(401).send({ message: "Invalid Login or Password!" })
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Login or Password!" })
        const token = user.generateAuthToken();
        res.status(200).send({
            data: {
                token,
                login: user.login,
                profilePic: user.profilePic
            }, message: "logged in successfully." })
        console.log(new Date(),'User', user.get("login"), 'logged in.')

    } catch (error) {
        console.log(new Date(), "Error logging in user:", error)
        res.status(500).send({ message: "Internal Server Error!" })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.status(200).send({ message: "Logged out successfully."})
        console.log(new Date(), "User", req.user, "logged out.")
    } catch (error) {
        console.log(new Date(), "Error logging out user:", error)
        res.status(500).send({ message: "Internal Server Error!" })
    }
}

/*
    Authentication function that checks if the user is
    logged in.
 */
const auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) return res.status(401).send({ message: "Access denied. No token provided." })
    try {
        req.user = jwt.verify(token, process.env.JWTPRIVATEKEY)
        next()
    } catch (err) {
        res.status(400).send({ message: "Invalid token." })
    }
}

/*
    Function allowing user to find desired user by
    his login.
 */
const searchUsers = async (req, res) => {
    const login = req.params.login.toString()

}

/*
    Function that shows user data.
 */
const userProfile = async (req, res) => {
    try {
        const userData = await User.findOne({_id: new mongoose.Types.ObjectId(req.body._id)})
            .select("-_id -password -__v -createdAt -updatedAt")
            .populate([
                {path: 'followers', select: 'login profilePic'},
                {path: 'following', select: 'login profilePic'}
            ])
        if(!userData)
            return res.status(401).send({ message: "User not found" })

        const userPosts = await Post.find({ author: new mongoose.Types.ObjectId(req.body._id)})
            .sort({updatedAt: -1})
            .populate({
                path: 'likes',
                select: 'login'
            })
            .populate({
                path: 'author',
                select: 'login profilePic'
            })
            .populate({
                path: 'comments',
                select: 'text author likes',
                populate: [
                    {
                        path: 'author',
                        select: 'login profilePic'
                    },
                    {
                        path: 'likes',
                        select: 'login'
                    }]
            })
        res.send({
            user: userData,
            posts: userPosts
        });
    } catch (err) {
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function allowing user to edit his data.
 */
// TODO unique login validation
const editUser = async (req, res) => {
    const validate = (data) => {
        const schema = Joi.object({
            firstName: Joi.string()
                .optional()
                .label("First name"),
            lastName: Joi.string()
                .optional()
                .label("Last name"),
            login: Joi.string()
                .required()
                .label("Login"),
            email: Joi.string()
                .email()
                .required()
                .label("E-mail"),
            bio: Joi.string()
                .optional()
                .max(1000),
            profilePic: Joi.string()
                .optional()
                .label("Profile Picture")
        })
        return schema.validate(data)
    }
    try {
        let user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        let updatedUserData = { ...user.toObject(), ...req.body }

        // Normalize login and email if present
        if (updatedUserData.login) {
            updatedUserData.login = updatedUserData.login.trim().toLowerCase()
        }

        if (updatedUserData.email) {
            updatedUserData.email = updatedUserData.email.trim().toLowerCase()
        }

        const file = req.files ? req.files.image : null
        if (file) {
            const uploadPath = path.join(__dirname, "..", "uploads", "images", "profile", "", req.user._id.toString())
            fs.mkdirSync(uploadPath, { recursive: true })
            if (!/^image/.test(file.mimetype)) {
                return res.status(400).send({ message: "All files must be an images." })
            }

            if (file.size > Number(process.env.MAXFILESIZE)) {
                return res.status(400).send({ message: "Image size not allowed (max 2MB)." })
            }
            const imageName = Date.now() + "_" + file.name.replace(/\s+/g, "_")
            const imagePath = path.join(uploadPath, imageName)

            // Clear directory
            if (fs.existsSync(uploadPath)) {
                const files = fs.readdirSync(uploadPath);
                for (const file of files) {
                    const filePath = path.join(uploadPath, file);
                    // Check if it is a file not a directory
                    if (fs.lstatSync(filePath).isFile()) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            // save image file to the server
            await file.mv(imagePath)
            // get relative path to the image from the public 'uploads' directory
            const publicPath = path.join(__dirname, "..", "uploads");
            const relativeImagePath = path.relative(publicPath, imagePath).split(path.sep).join("/");
            // store relative URL in the database
            updatedUserData.profilePic = `/uploads/${relativeImagePath}`;
        }
        delete updatedUserData._id
        delete updatedUserData.birthDate
        delete updatedUserData.password
        delete updatedUserData.followers
        delete updatedUserData.following
        delete updatedUserData.createdAt
        delete updatedUserData.updatedAt
        delete updatedUserData.__v
        console.log(updatedUserData)
        const { error } = validate(updatedUserData)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const updatedUser = await User.findByIdAndUpdate(req.user._id,
            { $set: updatedUserData },
            { new: true, runValidators: true}
        )
        console.log(new Date(), "User", updatedUser.login, "updated.")
        res.status(200).send(updatedUser)
    } catch (err) {
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function allowing user to delete his profile picture.
    It deletes both file saved in server and URL in database.
 */
const deleteUserProfilePic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { $unset: { profilePic: "" } });
        if (!user) {
            return res.status(404).send({ message: "User not found." })
        }
        user.profilePic = []
        const uploadPath = path.join(__dirname, "..", "uploads", "images", "profile", "", req.user._id.toString())
        // Clear directory
        if (fs.existsSync(uploadPath)) {
            const files = fs.readdirSync(uploadPath);
            for (const file of files) {
                const filePath = path.join(uploadPath, file);
                // Check if it is a file not a directory
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        }
        console.log(new Date(), "User", req.user, "profile picture deleted.")
        res.status(200).send({ message: "Picture deleted." })
    } catch (error) {
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function that allows a user to follow another user.
    It updates the "followers" list in the followed user's
    document and the "following" list in the follower's document.
 */
const followUser = async (req, res) => {
    const user = await User.findById(req.body._id)
    const myUser = await User.findById(req.user._id)
    if (!user) {
        console.error(new Date(), "User not found.")
        return res.status(404).send({ message: "User not found" })
    }
    if(!myUser) {
        console.error(new Date(), "User not found.")
        return res.status(404).send({ message: "User not found." })
    }
    let isAlreadyFollowed = false
    const followers = user.followers
    if (followers.length > 0) {
        for (const follower of followers) {
            if(follower.toString() === req.user._id.toString()) {
                isAlreadyFollowed = true
                break
            }
        }
    }

    if(isAlreadyFollowed) {
        user.followers.pull(myUser._id)
        myUser.following.pull(user._id)
        await user.save()
        await myUser.save()
        res.status(200).send({ message: "User unfollowed successfully." })
    } else {
        user.followers.push(myUser._id)
        myUser.following.push(user._id)
        await user.save()
        await myUser.save()
        req.notification = {
            recipient: new mongoose.Types.ObjectId(req.body._id),
            type: 'follow',
            fromUser: user._id,
            post: null
        }
        await sendNotification(req, res)
        res.status(200).send({ message: "User followed successfully." })
    }
}

/*
    Function that allows user to delete his account.
 */
const deleteUser = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        await Promise.all([
            Post.deleteMany({ author: userId }),
            Comment.deleteMany({ author: userId }),
            Notification.deleteMany({ recipient: userId }),
            Notification.deleteMany({ fromUser: userId }),
        ]);

        console.log(new Date(), "User and all associated data deleted.");
        res.status(200).send({ message: "User deleted successfully", data: deletedUser });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send({ message: "Internal server error", error: err.message });
    }
}


module.exports = { signUpUser, signInUser, logoutUser, auth, userProfile, editUser, deleteUserProfilePic, followUser, deleteUser }