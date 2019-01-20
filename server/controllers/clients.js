const mongoose = require('mongoose');
const AWS = require("aws-sdk");
const braintree = require('braintree');
const Busboy = require("busboy");
const geoip = require('geoip-lite');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const os = require('os');
const path = require("path");

const tempSub = require("../models/staticModels/subscription");
const Client = mongoose.model('Client');
const Meta = mongoose.model('Meta');

const config = require("../config/config");
const secret = require('../config/config').jwt_secret;

const BUCKET_NAME = config.bucketName;
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;

function uploadToS3(file, client) {
  console.log("*** STARTING TO UPLOADTOS3 FUNCTION")
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.createBucket(function () {
    var params = {
      Bucket: BUCKET_NAME,
      Key: `Profile/${file.name}`,
      Body: file.data,
      ACL: 'public-read'
    };
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log("*** Error in callback: ", err);
      }
      console.log("**** SUCCESS ****");
    });
  });
}




function sendVerificationEmail(email) {
  const url = `http://localhost:8000/verified/${email.client}/${email.message}`
  var output = ` 
    <h3>Hi ${email.name}!</h3>
    <br>
    <h5>To get started with creating your surveys, Please verify your emial by clicking the link below.</h5> 
    <br>
    <a href="${url}" style="margin:auto;background:#21ce99;border-radius:6px;color:#ffffff;text-align:center;display:block;font-family:Open Sans,Helvetica;font-size:14px;font-weight:regular;padding:15px;text-decoration:none;width:240px"  target="_blank">Verify Email</a>
    <br>
    <br>
    <p>If you feel like you recieved this email as a mistake please let us know by emailing us a <a href='mailto:support@surveysbyme.com' target='_top'>support@surveysbyme.com</a></p>
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
          subject: 'Please verify your account', // Subject line
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

class ClientsController {
  index(req, res) {
    Client.find({}).populate('connections.item').exec((err, clients) => {
      if (err) {
        return res.json(err);
      }
      return res.json(clients);
    });
  }

  create(req, res) {
    console.log("*** SERVER HIT CREATE CLIENT");
    if (req.body.password != req.body.confirm_pass) {
      return res.json({
        errors: {
          password: {
            message: "Your passwords do not match"
          }
        }
      })
    }
    Client.create(req.body, (err, client) => {
      console.log("*** SERVER CREATING CLIENT")
      if (err) {
        console.log("*** SERVER CREATING ERROR", err);
        return res.json(err);
      }
      let geo = geoip.lookup(req.ip);
      let meta = {
        address: req.ip,
        agent: req.body.agent,
        device: req.body.device,
        browser: req.body.platform,
        loc: geo,
        metaName: os.userInfo().username,
        referer: req.headers.referer,
        _client: client._id
      }
      Meta.create(meta, function (err, metas) {
        if (err) {
          console.log("___ CREATE SURVEY QUESTION ERROR ___", err);
          return res.json(err);
        } else {
          console.log("CREATING META SUCCESS", metas);
          Client.findByIdAndUpdate(req.params.id, {
            $push: { _meta: metas._id }
          }, { new: true }, (err, updatedClient) => {
            if (err) {
              console.log("___ UPDATE FINDING CLIENT ERROR ___", err);
              return res.json(err);
            }
              console.log("*** SERVER CLIENT CREATED");
              let email = {
                client: updatedClient._id,
                contact: updatedClient.email,
                name: updatedClient.firstName,
                message: updatedClient.grt
              }
              sendVerificationEmail(email);
              return res.json(updatedClient) 
          })
        }
      })
    })
  }

  authenticate(req, res) {
    console.log("___ SERVER HIT AUTHENTICATE ___");

    Client.findOne({ email: req.body.email }).select("+password").populate('_surveys').exec((err, client) => {
      if (err) {
        console.log("____ AUTHENTICATE ERROR ____", err);
        return res.json("____ AUTHENTICATE ERROR ____" + err);
      }
      if (client && client.authenticate(req.body.password)) {

        console.log("_____CLIENT LOGGING IN_____");
        var token = jwt.sign({ client }, secret, { expiresIn: '1h'});

        // CHECK IF CLIENT IS IN TRIAL OR SUBSCRIPTION
        if (client.subscriptionStatus === 'Trial') {
          req.session.client = {
            _id: client._id,
            n: client.firstName + " " + client.lastName,
            a8o1: client.role,
            b8o1: client._subscription,
            c8o1: client.surveyCount,
            d: client.lastUseDate,
            s: client._surveys,
            status: client.subscriptionStatus,
            token: `Bearer ${token}`,
            v: client.verified
          };

          return res.json(req.session.client);
        } else {
          // CREATE GATEWAY TO BRAINTREE TO CHECK CLIENTS SUBSCRIPTION
          let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
          });

          gateway.subscription.find(client.subscriptionId, function (err, result) {
            if (err) {
              console.log("ERROR INSIDE", err);
            }

            // CHECK IF STORED PAYED THROUGH DATE IS BEHIND THE SUBSCRIBED PAYTHROUGH DATE
            if (result.paidThroughDate > client.paidThroughDate) {

              let subObject = {};
              for (let sub of tempSub) {
                if (sub.name === client._subscription) {
                  subObject = sub
                }
              }

              Client.findById(client._id, (err, paidClient) => {
                if (err) {
                  console.log("ERROR FINDING CLIENT TO UPDATE", err)
                  return res.json(err);
                }
                paidClient._subscription = subObject.name;
                paidClient.surveyCount += subObject.surveyCount;
                paidClient.paidThroughDate = result.paidThroughDate;
                paidClient.subscriptionStatus = result.status;
                paidClient.save((err, subscribedClient) => {
                  if (err) {
                    console.log(`___ SAVE SUBSCRIBED CLIENT ERROR ___`, err);
                    return res.json(err);
                  }
                  console.log(`___ UPDATED SUBSCRIBED CLIENT ___`, subscribedClient);
                  req.session.client = {
                    _id: subscribedClient._id,
                    n: subscribedClient.firstName + " " + subscribedClient.lastName,
                    a8o1: subscribedClient.role,
                    b8o1: subscribedClient._subscription,
                    c8o1: subscribedClient.surveyCount,
                    d: subscribedClient.lastUseDate,
                    s: subscribedClient._surveys,
                    status: subscribedClient.status,
                    token: `Bearer ${token}`,
                    v: subscribedClient.verified
                  };
                  return res.json(req.session.client);
                });
              });
            } else {
              
              req.session.client = {
                _id: client._id,
                n: client.firstName + " " + client.lastName,
                a8o1: client.role,
                b8o1: client._subscription,
                c8o1: client.surveyCount,
                d: client.lastUseDate,
                s: client._surveys,
                status: result.status,
                token: `Bearer ${token}`,
                v: client.verified
              };
              return res.json(req.session.client);
            }
          })
        }
      } else {
        return res.json({
          errors: {
            login: {
              message: 'Invalid credentials'
            }
          }
        });
      }
    })
  }

  show(req, res, next) {
    Client.findById({ _id: req.params.id }).lean()
      .populate('_surveys')
      .populate('category')
      .exec(function (err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
  }

  updateVerifiedEmail(req, res) {
    Client.findByIdAndUpdate(
      req.params.id,
      { $set: { verified: true } },
      { new: true },
      (err, client) => {
        if (err) {
          return res.json(err);
        }
        return res.json(client);
      }
    );
  }
  update(req, res) {
    Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, client) => {
        if (err) {
          return res.json(err);
        }
        return res.json(client);
      }
    );
  }

  session(req, res) {
    if (req.session.client_id) {
      Client.findById(req.session.client_id, (err, client) => {
        if (err) {
          return res.json(err);
        }
        return res.json(client);
      });
    } else {
      return res.json({ status: false });
    }
  }

  logout(req, res) {
    delete req.session.client_id;
    return res.json({ status: true });
  }

  delete(req, res) {
    Client.findByIdAndRemove(req.params.id, (err, client) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    })
  }

  //Clients Images
  upload(req, res) {
    console.log("___ SERVER HIT UPLOAD___");
    let busboy = new Busboy({ headers: req.headers });
    if (req.files.picture) {
      let file = req.files.picture;
      let file_type = file.mimetype.match(/image\/(\w+)/);
      let new_file_name = '';
      if (file_type) {
        new_file_name = `${new Date().getTime()}.${file_type[1]}`;
        file.name = new_file_name;
        busboy.on("finish", function () {
          const client = req.params.id;
          const file = req.files.picture;
          uploadToS3(file, client);
        });
        req.pipe(busboy);
      }
      console.log("__ UPLOADED AND ABOUT TO SAVE CLIENT");
      Client.updateOne({ _id: req.params.id }, { $set: { picture: file.name } }).exec((err, client) => {
        if (err) {
          console.log("___ UPDATE CLIENT ERROR ___",err);
          return res.json(err);
        }
        console.log("___ UPDATED CLIENT ___");
        return res.json(client);
      });
    } else {
      console.log("___ ERROR NO PICTURE ___");
    }
  }
}

module.exports = new ClientsController();
