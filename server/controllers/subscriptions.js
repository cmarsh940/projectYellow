const mongoose = require('mongoose');
const Subscription = mongoose.model('Subscription');

class SubscriptionsController {
    index(req, res) {
        Subscription.find({}, (err, subscriptions) => {
            if (err) {
                return res.json(err);
            }
            return res.json(subscriptions);
        });
    }

    create(req, res) {
        Subscription.create(req.body, (err, subscription) => {
            if (err) {
                return res.json(err);
            }
            return res.json(subscription);
        });
    }

    show(req, res) {
        Subscription.findById(req.params.id, (err, subscription) => {
            if (err) {
                return res.json(err);
            }
            return res.json(subscription);
        });
    }

    update(req, res) {
        Subscription.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, subscription) => {
                if (err) {
                    return res.json(err);
                }
                return res.json(subscription);
            }
        );
    }

    delete(req, res) {
        Subscription.findByIdAndRemove(req.params.id, (err, subscription) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new SubscriptionsController();
