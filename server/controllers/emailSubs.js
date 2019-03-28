const mongoose = require('mongoose');
const EmailSub = mongoose.model('EmailSub');


class EmailSubsController {
    report(req, res) {
        EmailSub.find({}).exec((err, emails) => {
            if (err) {
                return res.json(err);
            }
            return res.json(emails);
        });
    }

    create(req, res) {
        EmailSub.create(req.body, (err, email) => {
            if (err) {
                console.log("*** ERROR CREATING EMAIL SUBSCRIPTION ***", err)
                return res.json(err);
            }
            return res.json(email);
        });
    }

    delete(req, res) {
        EmailSub.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }

}

module.exports = new EmailSubsController();