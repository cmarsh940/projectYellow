const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const User = mongoose.model('User');
const accountSid = require("../config/config").accountSid;
const authToken = require("../config/config").authToken;
const smsNumber = require("../config/config").twilioNumber;

const client = require('twilio')(accountSid, authToken);

class TextsController {

    text(req, res) {
        console.log("___ HIT TEXT ___");
        console.log("req.body", req.body);
        let users = req.body._selected;
        users.forEach(user => {
            let url = `http://localhost:8000/pSurvey/${user._id}/${user._survey}`
            let output = `Please participate in our survey. ${url} `;

            client.messages
                .create({ from: smsNumber, body: output, to: user.phone })
                .then(message => {
                    User.findById(user._id, (err, user) => {
                        if (err) {
                            console.log("ERROR FINDING USER", err);
                            return res.json(err);
                        }

                        user.textSent = true;
                        user.messageSID = message.sid;
                        user.save((err, textedUser) => {
                            if (err) {
                                console.log(`___ SAVE TEXTED USER ERROR ___`, err);
                                return res.json(err);
                            }
                            console.log("TEXTED USER", textedUser);
                            console.log(`___ TEXT MESSAGE SENT AND SAVED TO USER ___`);
                            return res.json(textedUser);
                        });
                    });
                })
                .done();
        });
    }

}
module.exports = new TextsController();