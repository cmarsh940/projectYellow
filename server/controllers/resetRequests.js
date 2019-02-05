const mongoose = require('mongoose');
const ResetRequest = mongoose.model('ResetRequest');
const Client = mongoose.model('Client');

const config = require("../config/config");

const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");


function sendVerificationEmail(email) {
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
            console.log("CLIENT IS", client);
            if (!client || err) {
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
                    let newRequest = {
                        _client: client._id,
                        _request: request._id
                    }
                    return res.json(newRequest);
                });
            });
        })
    }

    verify(req, res) {
        console.log("___ SERVER HIT VERIFY ResetRequest ___");
        ResetRequest.findById(req.body.requestId, (err, reset) => {
            console.log("reset", reset)
            if (!reset || err) {
                console.log("___ VERIFY RESET ERROR ___", err);
                return res.json(err);
            }
            if (req.body.number != reset.token ) {
                console.log("number and token dont match")
                return res.json({
                    errors: {
                        password: {
                            message: "Your token is not authorized"
                        }
                    }
                })
            }
            if (req.body.clientId != reset._client ) {
                console.log("WRONG CLIENT TOKEN")
                return res.json({
                    errors: {
                        password: {
                            message: "Unexpected error"
                        }
                    }
                })
            }
            console.log("TRUE")
            return res.json(reset);
        });
    }

    update(req, res) {
        console.log("___ SERVER HIT UPDATE PASSWORD ___", req.body);
        if (req.body.password != req.body.confirm_pass) {
            return res.json({
                errors: {
                    password: {
                        message: "Your passwords do not match"
                    }
                }
            })
        }

        Client.findById({ _id: req.body.id }).select("+password").select("+requestedReset").exec((err, client) => {
            console.log("*** SERVER UPDATING CLIENT PASSWORD")
            if (!client || err) {
                console.log("*** SERVER CREATING ERROR", err);
                return res.json(err);
            }
            client.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
            client.requestedReset = false;
            client.resetId = '';
            client.save((err, updatedClient) => {
                if (err) {
                    console.log(`___ CLIENT SAVE REST REQUEST ERROR ___`, err);
                    return res.json(err);
                }
                console.log(`___ UPDATED CLIENT REQUEST___`);
                ResetRequest.findById(req.body.resetId, (err, updateRequest) => {
                    if (!updateRequest || err) {
                        console.log("___ VERIFY RESET ERROR ___", err);
                        return res.json(err);
                    }
                    updateRequest.finished = true;
                    updateRequest.save((err, finishedRequest) => {
                        if (!finishedRequest || err) {
                            console.log(`___ CLIENT SAVE REST REQUEST ERROR ___`, err);
                            return res.json(err);
                        }
                        console.log("FINISHED UPDATING PASSWORD");
                        return res.json(finishedRequest);
                    })
                })
            });
        })
    }
}

module.exports = new ResetRequestsController();