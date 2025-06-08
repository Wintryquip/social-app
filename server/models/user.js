const mongoose = require("mongoose")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date, required: true},
    login: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePic: { type: String },
    bio: {type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true})

const User = mongoose.model("User", userSchema)

const minAge = new Date()
minAge.setFullYear(minAge.getFullYear() - 13)

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .optional()
            .label("First name"),
        lastName: Joi.string()
            .optional()
            .label("Last name"),
        birthDate: Joi.date()
            .required()
            .min('1-1-1900')
            .max(minAge)
            .label("Birth date"),
        login: Joi.string()
            .required()
            .label("Login"),
        email: Joi.string()
            .email()
            .required()
            .label("E-mail"),
        password: passwordComplexity()
            .required()
            .label("Password"),
        bio: Joi.string()
            .optional()
            .max(1000),
    })
    return schema.validate(data)
}

module.exports = { User, validate }