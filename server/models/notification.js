const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'follow', 'commentLike'], required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    read: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = { Notification }