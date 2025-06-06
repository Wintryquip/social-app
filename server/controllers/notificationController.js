const { Notification } = require('../models/notification')
const mongoose = require('mongoose')

/*
    Function sending notification to user.
    It prevents from spam or sending notification to oneself.
 */
const sendNotification = async (req, res) => {
    try {
        // prevent from sending to oneself
        if(req.notification.recipient.toString() !== req.notification.fromUser.toString()) {
            // prevent from spam
            const query = {
                recipient: req.notification.recipient,
                fromUser: req.notification.fromUser
            };

            if (['like', 'comment'].includes(req.notification.type)) {
                query.post = req.notification.post
            }
            if ('commentLike' === req.notification.type) {
                query.comment = req.notification.comment
            }

            const existing = await Notification.findOne(query);
            if (existing)
                return;

            const notification = new Notification({
                recipient: req.notification.recipient,
                type: req.notification.type,
                fromUser: req.notification.fromUser,
                post: req.notification.post,
                comment: req.notification.comment
            });
            await notification.save()
            delete req.notification
            console.log(new Date(), "Notification sent:", notification)
        }
    } catch (error) {
        console.log(new Date(), "Failed attempt sending notification: ", error);
    }
}

/*
    Function allowing user to see his notifications.
 */
const showNotifications = async (req, res) => {
    try {
        deleteNotification(req, res) // delete old notifications
        const notifications = await Notification.find({recipient: req.user._id})
            .populate({
                path: 'fromUser',
                select: 'login'
            })
        res.status(200).send({notifications})
    } catch (error) {
        console.log(new Date(), "Error fetching notifications: ", error);
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function setting field `read` to true if user saw notification.
 */
const setReadNotifications = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ message: "Invalid or missing notification ID." });
        }

        const notification = await Notification.findById(_id)
        if(!notification) {
            console.error(new Date(), "Notification not found.")
            return res.status(404).send({ message: "Notification not found." })
        }
        if (notification.recipient.toString() !== req.user._id.toString()) {
            console.error(new Date(), "WARNING: Unauthorized edit attempt! User", req.user, "tried to modify notification", _id , "which does not belong to him.")
            return res.status(403).send({ message: "Notification does not belongs to you!"})
        }
        await Notification.findByIdAndUpdate(_id,
            { $set: { read: true } })
        return res.status(200).send({ message: "Notification read." })
    } catch (error) {
        console.log(new Date(), "Failed attempt setting read notifications: ", error);
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function allowing user to delete his old notifications
 */
const deleteNotification = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id, read: true });
        console.log(new Date(), "Read notifications deleted successfully.");
    } catch (error) {
        console.log(new Date(), "Failed attempt deleting notifications: ", error);
    }
}

module.exports = { sendNotification, showNotifications, setReadNotifications }