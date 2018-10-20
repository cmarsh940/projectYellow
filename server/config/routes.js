const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const path = require('path');
const Payments = require('../controllers/payments');
const Subscriptions = require('../controllers/subscriptions');
const Surveys = require('../controllers/surveys');
const Users = require('../controllers/users');
const Questions = require('../controllers/questions');

const PermissionMiddleware = require('../config/middleware/auth.permission.middleware');
const ValidationMiddleware = require('../config/middleware/auth.validation.middleware');
const config = require('./config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

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
                req.jwt = jwt.verify(Authorization[1], secret);
                console.log("NEXT");
                return next();
            }

        } catch (err) {
            console.log("ERROR", err)
            return res.status(403).send();
        }
    } else {
        if (req.method === 'GET') {
            console.log("ITS A GET");
            return next();
        } else {
            console.log("RETURNING EVERYTHING ELSE", res);
            return res.status(401).send();
        }
    }
};


module.exports = function (app) {
    // CLIENT
    app.get('/api/clients', Clients.index);
    app.post('/api/clients', Clients.create);
    app.delete('/api/clients', Clients.logout);
    app.post('/api/clients/login', Clients.authenticate);
    app.delete('/api/clients/:id', [
        validJWTNeeded,
        Clients.delete
    ]);
    app.get('/api/clients/:id', [
        validJWTNeeded,
        Clients.show
    ]);
    app.put('/api/clients/:id', [
        validJWTNeeded,
        Clients.update
    ]);
    app.put('/api/clients/verifyemail/:id', Clients.updateVerifiedEmail);
    app.get('/sessions', Clients.session);

    // IMAGES
    app.post('/api/upload/portfolio/:id', [
        validJWTNeeded,
        Clients.upload
    ]);

    // PAYMENTS
    app.get('/api/braintree/getclienttoken', Payments.getClientToken);
    app.post('/api/braintree/createpurchase', Payments.checkout);

    // QUESTIONS
    app.get('/api/questions', Questions.index);
    app.post("/api/questions/:id", Questions.create);
    app.delete('/api/questions/:id', Questions.delete);
    app.get('/api/questions/:id', Questions.show);
    app.put('/api/questions/:id', Questions.update);

    // SUBSCRIPTIONS
    app.get('/api/subscriptions', [
        validJWTNeeded,
        Subscriptions.index
    ]);
    app.post('/api/subscriptions', [
        validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        Subscriptions.create
    ]);
    app.delete('/api/subscriptions/:id', [
        validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        Subscriptions.delete
    ]);
    app.get('/api/subscriptions/:id', [
        validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        Subscriptions.show
    ]);
    app.put('/api/subscriptions/:id', [
        validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        Subscriptions.update
    ]);
    
    // SURVEYS
    app.get('/api/surveys', Surveys.index);
    app.post('/api/surveys', Surveys.create);
    app.delete('/api/surveys/:id', Surveys.delete);
    app.get('/api/surveys/:id', Surveys.show);
    app.put('/api/surveys/:id', Surveys.update);
    app.put('/api/answer/surveys/:id', Surveys.answerSurvey);

    // SURVEY CATEGORIES
    app.get('/api/survey-categories', Categories.index);
    app.post('/api/survey-categories', [
        validJWTNeeded,
        Categories.create
    ]);
    app.delete('/api/survey-categories/:id', [
        validJWTNeeded,
        Categories.delete
    ]);
    app.get('/api/survey-categories/:id', [
        validJWTNeeded,
        Categories.show
    ]);
    app.put('/api/survey-categories/:id', [
        validJWTNeeded,
        Categories.update
    ]);

    // USERS
    app.get('/api/users', Users.index);
    app.post('/api/users', Users.create);
    app.delete('/api/users/:id', Users.delete);
    app.get('/api/users/:id', Users.show);
    app.put('/api/users/:id', Users.update);
    

    // CATCH ALL
    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('./public/dist/index.html'));
    })
}