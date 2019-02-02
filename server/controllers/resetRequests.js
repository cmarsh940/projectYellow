const mongoose = require('mongoose');
const ResetRequest = mongoose.model('ResetRequest');
const Client = mongoose.model('Client');

const config = require("../config/config");

const nodemailer = require('nodemailer');


function sendResetEmail(email) {
    let output = ` 
    <h3>Hi ${email.name}!</h3>
    <br>
    <h5>Your password reset number is</h5> 
    <br>
    ${email.token}
    <br>
    <h5>For security resons, this number will expire in 2 hours.</h5>
    <p>If you feel like you recieved this email as a mistake please let us know by emailing us at <a href='mailto:support@surveysbyme.com' target='_top'>support@surveysbyme.com</a></p>
  `
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: config.host,
            port: 465,
            secure: true,
            auth: {
                user: config.verificationEmail,
                pass: config.verificationPass
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"nodemailer contact" <noreply@surveysbyme.com>', // sender address
            to: email.contact, // list of receivers
            subject: 'Password reset', // Subject line
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

class ResetRequestsController {

    create(req, res) {
        console.log("___ SERVER HIT CREATE ResetRequest ___");

        Client.findOne({ email: req.body.email }).select("+_resetRequest").exec((err, client) => {
            if (err) {
                console.log("____ AUTHENTICATE ERROR ____", err);
                return res.json(err);
            }
            let token = Math.floor((Math.random() * 10000) + 99999);
            console.log("RESET TOKEN IS:", token);
            let reset = {
                token: token,
                finished: false,
                _client: client._id
            }
            ResetRequest.create(reset, (err, request) => {
                if (err) {
                    console.log("___ ResetRequest ERROR ___", err);
                    return res.json(err);
                }
                console.log("___ CREATEDResetRequest ___", request);
                client._resetRequest.push(request._id);
                client.resetId = request._id;
                client.requestedReset = true;
                client.save((err, updatedClient) => {
                    if (err) {
                        console.log(`___ CLIENT SAVE REST REQUEST ERROR ___`, err);
                        return res.json(err);
                    }
                    console.log(`___ UPDATED CLIENT REQUEST___`);
                    let email = {
                        client: updatedClient._id,
                        contact: updatedClient.email,
                        name: updatedClient.firstName,
                        token: token
                    }
                    sendVerificationEmail(email);
                    return res.json(updatedClient);
                });
            });
        })
    }

    verify(req, res) {
        console.log("___ SERVER HIT VERIFY ResetRequest ___");
        return true
        // ResetRequest.findOne(, (err, verify) => {
        //     if (err) {
        //         console.log("___ VERIFY RESET ERROR ___", err);
        //         return res.json(err);
        //     }
        //     console.log("___ CREATEDResetRequest ___");
        //     client._resetRequest.push(request._id);
        //     client.save((err, updatedClient) => {
        //         if (err) {
        //             console.log(`___ CLIENT SAVE REST REQUEST ERROR ___`, err);
        //             return res.json(err);
        //         }
        //         console.log(`___ UPDATED CLIENT REQUEST___`);
        //         return res.json(updatedClient);
        //     });
        // });
    }
}

module.exports = new ResetRequestsController();