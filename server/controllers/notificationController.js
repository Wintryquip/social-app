const { Notification } = require('../models/notification')

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

            if (req.notification.type === 'like') {
                query.post = req.notification.post;
            }

            const existing = await Notification.findOne(query);
            if (existing)
                return;

            const notification = new Notification({
                recipient: req.notification.recipient,
                type: req.notification.type,
                fromUser: req.notification.fromUser,
                post: req.notification.post
            });
            await notification.save()
            delete req.notification
        }
    } catch (error) {
        console.log(new Date(), "Failed attempt sending notification: ", error);
    }
}

module.exports = { sendNotification }