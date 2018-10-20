const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Subscription = mongoose.model('Subscription');

const config = require("../config/config");
const secret = require('../config/config').jwt_secret;

const BUCKET_NAME = "surveysbyme";
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;

const path = require("path");
const AWS = require("aws-sdk");
const Busboy = require("busboy");
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');


// James wagner's example(signed url)
// function uploadToS3(file, client) {
//   console.log("*** STARTING TO UPLOADTOS3 FUNCTION")
//   console.log("*** S3 FILE:", file)
//   var aws2 = new AWS.S3({
//     accessKeyId: IAM_USER_KEY,
//     secretAccessKey: IAM_USER_SECRET,
//     Bucket: BUCKET_NAME
//   });

//   aws2.getSignedUrl(
//     "putObject",
//     {
//       Bucket: "surveysbyme",
//       Key: `Profile / ${ file.name }`,
//       ContentType: file.type
//     },
//     (err, url) => {
//       if (err) {
//         console.log("PUT ERR ON GETSINGNED URL",err);
//       }
//       console.log(url);
//     }
//   );
// }

function uploadToS3(file, client) {
  console.log("*** STARTING TO UPLOADTOS3 FUNCTION")
  console.log("*** S3 FILE:", file)
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
        console.log("*** UPLOAD PARAMS: ", params);
      }
      console.log("**** SUCCESS", data);
    });
  });
}




function sendVerificationEmail(email) {
  const url = `http://localhost:8000/verified/${email.client}/${email.message}`
  var output = ` 
    <p>Please verify your account</p> 
    <a href="${url}" target="_blank">Verify Email</a>`

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
    console.log("*** REQ BODY", req.body);
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
      console.log("*** SERVER CLIENT CREATED", client);
      var email = {
        client: client._id,
        contact: client.email,
        message: client.grt
      }
      sendVerificationEmail(email);
      return res.json(client)
    })
  }

  authenticate(req, res) {
    console.log("___ SERVER HIT AUTHENTICATE ___");
    console.log("___ SENT TO SERVER ___", req.body);

    Client.findOneAndUpdate({ email: req.body.email }, { $addToSet: { used: req.body.used } }).select("+password").populate('_surveys').exec((err, client) => {
      if (err) {
        console.log("____ AUTHENTICATE ERROR ____", err);
        return res.json("____ AUTHENTICATE ERROR ____" + err);
      }
      if (client && client.authenticate(req.body.password)) {
        console.log("_____CLIENT LOGGING IN_____", client);
        var token = jwt.sign({ client }, secret, { expiresIn: '1h'});
        req.session.client = {
          _id: client._id,
          n: client.firstName + " " + client.lastName,
          a8o1: client.role,
          b8o1: client.subscription,
          s: client._surveys,
          token: `Bearer ${token}`,
          v: client.verified
        };
        if(err) {
          console.log("ERROR INSIDE", err);
        }
        return res.json(req.session.client);
      }
      console.log("ERROR", err);
      return res.json(err);
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
        console.log("___ UPDATED CLIENT ___", client);
        return res.json(client);
      });
    } else {
      console.log("___ ERROR NO PICTURE ___");
    }
  }

}

module.exports = new ClientsController();
