const jwt = require('jsonwebtoken');
const secret = require('../config').jwt_secret;
const crypto = require('crypto');
const bcrypt = require("bcryptjs");

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({ error: 'need to pass refresh_token field' });
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refresh_key).update(req.jwt.user_id + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(400).send({ error: 'Invalid refresh token' });
    }
};


exports.validJWTNeeded = (req, res, next) => {
    console.log("HIT VALIDATE TOKEN");
    console.log("HEADERS", req.headers)
    if (req.headers['authorization']) {
        console.log("RECIEVED HEADER WITH AUTHORIZATION IN IT");
        try {
            console.log("TRYING");
            let Authorization = req.headers['authorization'].split(' ');
            if (Authorization[0] !== 'Bearer') {
                console.log("is bearer there", Authorization[0]);
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(Authorization[1], secret);
                console.log("req.jwt", req.jwt);
                console.log("NEXT");
                return next();
            }

        } catch (err) {
            console.log("ERROR",err)
            return res.status(403).send();
        }
    } else {
        if(req.method === 'GET') {
            console.log("ITS A GET");
            return next();
        } else{
            console.log("RETURNING EVERYTHING ELSE", res);
            return res.status(401).send();
        }
    }
};