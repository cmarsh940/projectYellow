const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const EmailSubs = require('../controllers/emailSubs');
const Feedbacks = require('../controllers/feedbacks');
const Notifications = require('../controllers/notifications');
const path = require('path');
const Payments = require('../controllers/payments');
const ResetRequests = require('../controllers/resetRequests');
const Surveys = require('../controllers/surveys');
const Texts = require('../controllers/texts');
const Users = require('../controllers/users');

const jwt = require('jsonwebtoken');
const secret = require('./config').jwt_secret;


async function validJWTNeeded(req, res, next) {
    if (req.headers['authorization']) {
        console.log("RECIEVED HEADER WITH AUTHORIZATION IN IT");
        try {
            let Authorization = await req.headers['authorization'].split(' ');
            if (Authorization[0] !== 'Bearer') {
                console.log("Not Valid");
                return res.status(401).send();
            } else {
                req.jwt = await jwt.verify(Authorization[1], secret);
                console.log("NEXT");
                return next();
            }

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("ERROR TOKEN EXIRED", err);
                return res.json(err);
            } else {
                console.log("ERROR", err)
                return res.status(403).send();
            }
        }
    } 
    else {
        console.log("ELSE");
        // return res.status(401).send();
        return next();
    }
};

async function validRole(req, res, next) {
    if (req.headers['sh1p']) {
        console.log("RECIEVED HEADER WITH ROLE IN IT");
        try {
            let Role = await req.headers['sh1p'].split(' ');
            if (Role[0] !== 'Anchored') {
                console.log("Not Valid");
                return res.status(401).send();
            } else {
                console.log("ROLE IS SET");
                return next();
            }
        }
        catch (err) {
            if (err.name === 'ROLE ERRO') {
                console.log("ERROR ROLE", err);
                return res.json(err);
            } else {
                console.log("ERROR", err)
                return res.status(403).send();
            }
        }
    } else {
        console.log("ELSE");
        return res.status(401).send();
    }
};


module.exports = function (app) {
    // CLIENT
    app.post('/api/clients', Clients.create);
    app.delete('/api/clients', [
        validJWTNeeded, 
        Clients.logout
    ]);
    app.post('/api/clients/login', Clients.authenticate);
    // app.delete('/api/clients/:id', [
    //     validJWTNeeded,
    //     Clients.delete
    // ]);
    app.get('/api/clients/:id', [
        validJWTNeeded,
        Clients.show
    ]);
    app.get('/api/clients/info/:id', [
        validJWTNeeded,
        Clients.info
    ]);
    app.get('/api/clients/notifications/:id', [
        validJWTNeeded,
        Notifications.single
    ]);
    app.put('/api/clients/:id', [
        validJWTNeeded,
        Clients.update
    ]);
    app.put('/api/disableC/:id', [
        validJWTNeeded,
        Clients.disable
    ]);
    app.put('/api/clients/verifyemail/:id', Clients.updateVerifiedEmail);
    app.get('/sessions', Clients.session);


    // PASSWORD RESET
    app.post('/api/clients/resetPassword', ResetRequests.update);
    app.post('/api/clients/requestReset', ResetRequests.create);
    app.post('/api/clients/verifyReset', ResetRequests.verify);

    // EMAIL SUBSCRIPTION
    app.post('/api/add/emailSub', EmailSubs.create);

    // FEEDBACK
    app.post('/api/upload/feedback', Feedbacks.create);
    app.put('/api/feedbacks/:id', [
        validJWTNeeded,
        validRole,
        Feedbacks.update
    ]);

    // IMAGES
    app.post('/api/upload/portfolio/:id', [
        validJWTNeeded,
        Clients.upload
    ]);


    // PAYMENTS
    app.get('/api/braintree/getclienttoken', [
        validJWTNeeded,
        Payments.getClientToken
    ]);
    app.post('/api/braintree/createpurchase', [
        validJWTNeeded,
        Payments.checkout
    ]);
    app.put('/api/braintree/updatepurchase', [
        validJWTNeeded,
        Payments.update
    ]);
    app.put('/api/payment/cancel/:id', [
        validJWTNeeded,
        Payments.cancelSubscription
    ]);

    
    // SURVEYS
    app.get('/api/surveys', Surveys.index);
    app.post('/api/surveys', [
        validJWTNeeded,
        Surveys.create
    ]);
    app.delete('/api/surveys/:id', [
        validJWTNeeded,
        Surveys.delete
    ]);
    app.get('/api/surveys/:id', Surveys.show);
    app.get('/api/surveys/slug/:slug', [
        validJWTNeeded,
        Surveys.findBySlug
    ]);
    app.put('/api/surveys/:id', [
        validJWTNeeded,
        Surveys.update
    ]);
    app.put('/api/close/surveys/:id', [
        validJWTNeeded,
        Surveys.close
    ]);
    app.put('/api/open/surveys/:id', [
        validJWTNeeded,
        Surveys.open
    ]);
    app.put('/api/answer/surveys/:id', Surveys.answerSurvey);
    app.put('/api/answer/pSurveys/:id', Surveys.answerPrivateSurvey);


    // SURVEY CATEGORIES
    app.get('/api/survey-categories', [
        validJWTNeeded,
        Categories.index
    ]);
    app.post('/api/survey-categories', [
        validJWTNeeded,
        Categories.create
    ]);
    app.delete('/api/survey-categories/:id', [
        validJWTNeeded,
        Categories.delete
    ]);
    app.put('/api/survey-categories/:id', [
        validJWTNeeded,
        Categories.update
    ]);
    

    // TEXTING
    app.post('/api/sendSMS/:id', [
        validJWTNeeded,
        Texts.text
    ]);

    app.get('/api/users', [
        validJWTNeeded,
        Users.report
    ])

    app.post('/api/users', [
        validJWTNeeded,
        Users.create
    ]);
    app.get('/api/users/:id', [
        validJWTNeeded,
        Users.showClientsUsers
    ]);
    app.delete('/api/users/:id', [
        validJWTNeeded,
        Users.delete
    ]);
    app.put('/api/users/:id', [
        validJWTNeeded,
        Users.update
    ]);

    app.post('/api/usersUpload/:id', [
        validJWTNeeded,
        Users.upload
    ]);


    // REPORTS
    app.get('/api/reports/clients', [
        validJWTNeeded,
        validRole,
        Clients.report
    ]);
    app.get('/api/reports/emails', [
        validJWTNeeded,
        validRole,
        EmailSubs.report
    ]);
    app.delete('/api/reports/emails/:id', [
        validJWTNeeded,
        validRole,
        EmailSubs.delete
    ]);
    app.get('/api/reports/feedbacks', [
        validJWTNeeded,
        validRole,
        Feedbacks.report
    ]);
    app.get('/api/reports/surveys', [
        validJWTNeeded,
        validRole,
        Surveys.report
    ]);
    app.get('/api/reports/survey-categories', [
        validJWTNeeded,
        validRole,
        Categories.report
    ]);
    app.get('/api/reports/users', [
        validJWTNeeded,
        validRole,
        Users.report
    ]);

}