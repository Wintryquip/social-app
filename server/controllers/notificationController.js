const { Notification } = require('../models/notification')
// TODO show set and delete notification
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

}

/*
    Function setting field `read` to true if user saw notification.
 */
const setReadNotifications = async (req, res) => {

}

/*
    Function allowing user to delete his old notifications
 */
const deleteNotification = async (req, res) => {
    try {

    } catch (error) {
        console.log(new Date(), "Failed attempt deleting notification: ", error);
    }
}

module.exports = { sendNotification, showNotifications, setReadNotifications, deleteNotification }