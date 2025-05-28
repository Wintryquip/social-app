const {validate, User} = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Joi = require("joi")

const signUpUser = async (req, res) => {
    try {
        const {error} = validate(req.body)
        if(error)
            return res.status(400).send({message: error.details[0].message})
        const user = await User.findOne({ login: req.body.login })
        if(user)
            return res
                .status(409)
                .send({ message: "User with given email address already exists!"})
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send( { message: "User created successfully." })
        console.log(new Date(), "User", req.user, "registered in the database.")
    } catch (error) {
        res.status(500).send({ message: "Internal server error!" })
    }
}

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
        const user = await User.findOne({ login: req.body.login })
        if (!user)
            return res.status(401).send({ message: "Invalid Login or Password!" })
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Login or Password!" })
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully." })
        console.log(new Date(),'User', user.get("login"), 'logged in.')

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error!" })
    }
}

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

const userProfile = async (req, res) => {
    try {
        const userData = await User.findById(req.user._id).select("-_id -password -__v -createdAt -updatedAt")
        console.log(new Date(), "User", req.user, "accessed their profile")
        res.send(userData)
    } catch (err) {
        res.status(500).send({ message: "Internal server error!" })
    }
}

// TODO validation of updated data
// TODO user profile pic
const editUser = async (req, res) => {
    try {
        const updatedUserData = req.body
        delete updatedUserData.password
        const updatedUser = await User.findByIdAndUpdate(req.user._id,
            { $set: updatedUserData },
            { new: true, runValidators: true}
        ).select("-password -__v")
        console.log(new Date(), "User updated.")
        res.status(200).send(updatedUser)
    } catch (err) {
        res.status(500).send({ message: "Internal server error!"})
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        console.log(new Date(), "User Deleted.")
        res.status(200).send({ message: "User deleted successfully", data: deletedUser });
    } catch (err) {
        res.status(500).send({ message: "Internal server error", error: err.message });
    }
}

module.exports = { signUpUser, signInUser, auth, userProfile, editUser, deleteUser }