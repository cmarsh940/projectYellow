const mongoose = require('mongoose');
const Feedback = mongoose.model('Feedback');

class FeedbacksController {

    create(req, res) {
        Feedback.create(req.body, (err, feedback) => {
            if (err) {
                return res.json(err);
            }
            return res.json(feedback);
        });
    }
}

module.exports = new FeedbacksController();