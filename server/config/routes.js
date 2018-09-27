const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const path = require('path');
const Payments = require('../controllers/payments');
const Subscriptions = require('../controllers/subscriptions');
const Surveys = require('../controllers/surveys');
const Users = require('../controllers/users');
const Questions = require('../controllers/questions');


module.exports = function (app) {
    // CLIENT
    app.get('/api/clients', Clients.index);
    app.post('/api/clients', Clients.create);
    app.delete('/api/clients', Clients.logout);
    app.post('/api/clients/login', Clients.authenticate);
    app.delete('/api/clients/:id', Clients.delete);
    app.get('/api/clients/:id', Clients.show);
    app.put('/api/clients/:id', Clients.update);
    app.get('/sessions', Clients.session);

    // IMAGES
    app.post('/api/upload/portfolio/:id', Clients.upload);

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
    app.get('/api/subscriptions', Subscriptions.index);
    app.post('/api/subscriptions', Subscriptions.create);
    app.delete('/api/subscriptions/:id', Subscriptions.delete);
    app.get('/api/subscriptions/:id', Subscriptions.show);
    app.put('/api/subscriptions/:id', Subscriptions.update);
    
    // SURVEYS
    app.get('/api/surveys', Surveys.index);
    app.post('/api/surveys', Surveys.create);
    app.delete('/api/surveys/:id', Surveys.delete);
    app.get('/api/surveys/:id', Surveys.show);
    app.put('/api/surveys/:id', Surveys.update);
    app.put('/api/answer/surveys/:id', Surveys.answerSurvey);

    // SURVEY CATEGORIES
    app.get('/api/survey-categories', Categories.index);
    app.post('/api/survey-categories', Categories.create);
    app.delete('/api/survey-categories/:id', Categories.delete);
    app.get('/api/survey-categories/:id', Categories.show);
    app.put('/api/survey-categories/:id', Categories.update);

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