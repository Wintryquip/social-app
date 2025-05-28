const mongoose = require("mongoose")
const Joi = require("joi")

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    images: [{ type: String}],
    likes: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

const validate = (data) => {
    const schema = Joi.object({
        content: Joi.string()
            .max(2000)
            .allow(''),
        images: Joi.array()
            .items(Joi.string().uri())
            .optional(),
    });
    return schema.validate(data)
}

module.exports = {Post, validate}