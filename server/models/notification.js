const mongoose = require('mongoose')
const Joi = require("joi")

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    read: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

const Notification = mongoose.model("Notification", notificationSchema)

const validate = (data) => {
    const schema = Joi.object({
        recipient: Joi.string()
            .hex()
            .length(24)
            .required(),
        type: Joi.string()
            .valid('like', 'comment', 'follow', 'message')
            .required(),
        fromUser: Joi.string()
            .hex()
            .length(24)
            .required(),
        post: Joi.string()
            .hex()
            .length(24)
            .optional(),
        read: Joi.boolean()
            .optional(),
    });
    return schema.validate(data)
}

module.exports = { Notification, validate }