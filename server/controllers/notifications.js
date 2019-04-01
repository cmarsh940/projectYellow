const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
const Client = mongoose.model('Client');


class NotificationsController {
    single(req, res){
        Client.findById({ _id: req.params.id }).lean()
            .populate('_notifications')
            .exec(function (err, doc) {
                if (err) {
                    console.log('Error finding notifications', err);
                    return res.json(err);
                }
                let notifications = doc._notifications;
                return res.json(notifications);
            });
    }

    create(req, res) {
        Notification.create(req.body, (err, notification) => {
            if (err) {
                console.log("*** ERROR CREATING EMAIL SUBSCRIPTION ***", err)
                return res.json(err);
            }
            return res.json(notification);
        });
    }

    update(req, res) {
        Notification.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, notification) => {
                if (err) {
                    return res.json(err);
                }
                return res.json(notification);
            }
        );
    }

    delete(req, res) {
        Notification.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }

}

module.exports = new NotificationsController();