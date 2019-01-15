const mongoose = require('mongoose');
const Feedback = mongoose.model('Feedback');

class FeedbacksController {

    create(req, res) {
        console.log("___ SERVER HIT CREATE FEEDBACK ___");

        Feedback.create(req.body, (err, feedback) => {
            if (err) {
                console.log("___ FEEDBACK ERRO ___", err);
                return res.json(err);
            }
            console.log("___ CREATED FEEDBACK ___", feedback);
            return res.json(feedback);
        });
    }
}

module.exports = new FeedbacksController();