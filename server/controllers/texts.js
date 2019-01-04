const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const accountSid = require("../config/config").accountSid;
const authToken = require("../config/config").authToken;
const smsNumber = require("../config/config").twilioNumber;

const client = require('twilio')(accountSid, authToken);

class TextsController {

    text(req, res) {
        client.messages
            .create({ from: smsNumber, body: 'body', to: '+19408088285' })
            .then(message => console.log(message.sid))
            .done();
    }

}
module.exports = new TextsController();