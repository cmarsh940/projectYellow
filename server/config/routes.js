const path = require('path');
const Users = require('../controllers/users');
const Roles = require('../controllers/roles');
const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const Surveys = require('../controllers/surveys');
const Questions = require('../controllers/questions');
const Answers = require('../controllers/answers');


module.exports = function (app) {
    app.get('/api/clients', Clients.index);
    app.post('/api/clients', Clients.create);
    app.delete('/api/clients', Clients.logout);
    app.post('/api/clients/login', Clients.authenticate);
    app.delete('/api/clients/:id', Clients.delete);
    app.get('/api/clients/:id', Clients.show);
    app.put('/api/clients/:id', Clients.update);
    app.get('/session', Clients.session);

    app.get('/api/roles', Roles.index);
    app.post('/api/roles', Roles.create);
    app.delete('/api/roles/:id', Roles.delete);
    app.get('/api/roles/:id', Roles.show);
    app.put('/api/roles/:id', Roles.update);

    app.get('/api/survey-categories', Categories.index);
    app.post('/api/survey-categories', Categories.create);
    app.delete('/api/survey-categories/:id', Categories.delete);
    app.get('/api/survey-categories/:id', Categories.show);
    app.put('/api/survey-categories/:id', Categories.update);

    app.get('/api/surveys', Surveys.index);
    app.post('/api/surveys', Surveys.create);
    app.delete('/api/surveys/:id', Surveys.delete);
    app.get('/api/surveys/:id', Surveys.show);
    app.put('/api/surveys/:id', Surveys.update);

    app.get('/api/questions', Questions.index);
    app.post("//apiquestions/:id", Questions.create);
    app.delete('/api/questions/:id', Questions.delete);
    app.get('/api/questions/:id', Questions.show);
    app.put('/api/questions/:id', Questions.update);
    
    app.get('/api/answers', Answers.index);
    app.post("/api/answers/:id", Answers.create);
    app.delete('/api/answers/:id', Answers.delete);
    app.get('/api/answers/:id', Answers.show);
    app.put('/api/answers/:id', Answers.update);

    app.get('/api/users', Users.index);
    app.post('/api/users', Users.create);
    app.delete('/api/users/:id', Users.delete);
    app.get('/api/users/:id', Users.show);
    app.put('/api/users/:id', Users.update);


    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('./public/dist/index.html'));
    })
}