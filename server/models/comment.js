const mongoose = require('mongoose')
const Joi = require("joi")


const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true}
}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

const validate = (data) => {
    const schema = Joi.object({
        post: Joi.string()
            .hex()
            .length(24)
            .required(),
        author: Joi.string()
            .hex()
            .length(24)
            .required(),
        text: Joi.string()
            .min(1)
            .max(1000)
            .required(),
    })
    return schema.validate(data)
}

module.exports = { Comment, validate }