const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const EmailSubs = require('../controllers/emailSubs');
const Feedbacks = require('../controllers/feedbacks');
const path = require('path');
const Payments = require('../controllers/payments');
const Questions = require('../controllers/questions');
const Surveys = require('../controllers/surveys');
const Texts = require('../controllers/texts');
const Users = require('../controllers/users');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const secret = require('./config').jwt_secret;


// async function validJWTNeeded(req, res, next) {
//     if (req.headers['Authorization']) {
//         console.log("RECIEVED HEADER WITH AUTHORIZATION IN IT");
//         try {
//             let Authorization = await req.headers['Authorization'].split(' ');
//             if (Authorization[0] !== 'Bearer') {
//                 console.log("Not Valid");
//                 return res.status(401).send();
//             } else {
//                 req.jwt = jwt.verify(Authorization[1], secret);
//                 console.log("NEXT");
//                 return next();
//             }

//         } catch (err) {
//             if (err.name === 'TokenExpiredError') {
//                 console.log("ERROR TOKEN EXIRED", err);
//                 return res.json(err);
//             } else {
//                 console.log("ERROR", err)
//                 return res.status(403).send();
//             }
//         }
//     } else {
//         if (req.method === 'GET') {
//             console.log("ITS A GET");
//             return next();
//         } else {
//             console.log("RETURNING EVERYTHING ELSE", res);
//             return res.status(401).send();
//         }
//     }
// };


module.exports = function (app) {
    // CLIENT
    app.get('/api/clients', [
        passport.authenticate('jwt', { session: false }),
        Clients.index
    ]);
    app.post('/api/clients', Clients.create);
    app.delete('/api/clients', Clients.logout);
    app.post('/api/clients/login', Clients.authenticate);
    // app.delete('/api/clients/:id', [
    //     validJWTNeeded,
    //     Clients.delete
    // ]);
    app.get('/api/clients/:id', Clients.show);
    app.put('/api/clients/:id', [
        passport.authenticate('jwt', { session: false }),
        Clients.update
    ]);
    app.put('/api/clients/verifyemail/:id', Clients.updateVerifiedEmail);
    app.get('/sessions', Clients.session);

    // EMAIL SUBSCRIPTION
    app.post('/api/add/emailSub', EmailSubs.create);

    // FEEDBACK
    app.post('/api/upload/feedback', Feedbacks.create);

    // IMAGES
    app.post('/api/upload/portfolio/:id', [
        passport.authenticate('jwt', { session: false }),
        Clients.upload
    ]);

    // PAYMENTS
    app.get('/api/braintree/getclienttoken', Payments.getClientToken);
    app.post('/api/braintree/createpurchase', [
        passport.authenticate('jwt', { session: false }),
        Payments.checkout
    ]);
    app.put('/api/braintree/updatepurchase', [
        passport.authenticate('jwt', { session: false }),
        Payments.update
    ]);
    app.put('/api/payment/cancel/:id', [
        passport.authenticate('jwt', { session: false }),
        Payments.cancelSubscription
    ]);

    
    // SURVEYS
    app.get('/api/surveys', Surveys.index);
    app.post('/api/surveys', [
        passport.authenticate('jwt', { session: false }),
        Surveys.create
    ]);
    app.delete('/api/surveys/:id', [
        passport.authenticate('jwt', { session: false }),
        Surveys.delete
    ]);
    app.get('/api/surveys/:id', Surveys.show);
    app.put('/api/surveys/:id', [
        passport.authenticate('jwt', { session: false }),
        Surveys.update
    ]);
    app.put('/api/answer/surveys/:id', Surveys.answerSurvey);
    app.put('/api/answer/pSurveys/:id', Surveys.answerPrivateSurvey);

    // SURVEY CATEGORIES
    app.get('/api/survey-categories', Categories.index);
    app.post('/api/survey-categories', [
        passport.authenticate('jwt', { session: false }),
        Categories.create
    ]);
    app.delete('/api/survey-categories/:id', [
        passport.authenticate('jwt', { session: false }),
        Categories.delete
    ]);
    app.get('/api/survey-categories/:id', [
        passport.authenticate('jwt', { session: false }),
        Categories.show
    ]);
    app.put('/api/survey-categories/:id', [
        passport.authenticate('jwt', { session: false }),
        Categories.update
    ]);
    

    // TEXTING
    app.post('/api/sendSMS/:id', [
        passport.authenticate('jwt', { session: false }),
        Texts.text
    ]);

    // USERS
    app.post('/api/users', [
        passport.authenticate('jwt', { session: false }),
        Users.create
    ]);
    app.get('/api/users/:id', Users.showClientsUsers);
    app.delete('/api/users/:id', [
        passport.authenticate('jwt', { session: false }),
        Users.delete
    ]);
    app.put('/api/users/:id', [
        passport.authenticate('jwt', { session: false }),
        Users.update
    ]);

    app.post('/api/usersUpload/:id', [
        passport.authenticate('jwt', { session: false }),
        Users.upload
    ]);

    // CATCH ALL
    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('./public/dist/index.html'));
    })
}