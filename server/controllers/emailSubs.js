const mongoose = require('mongoose');
const EmailSub = mongoose.model('EmailSub');

class EmailSubsController {

    create(req, res) {
        EmailSub.create(req.body, (err, email) => {
            if (err) {
                return res.json(err);
            }
            return res.json(email);
        });
    }

}

module.exports = new EmailSubsController();