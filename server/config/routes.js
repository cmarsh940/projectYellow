const path = require('path');
const Users = require('../controllers/users');
const Roles = require('../controllers/roles');
const Categories = require('../controllers/categories');
const Clients = require('../controllers/clients');
const Surveys = require('../controllers/surveys');
const Questions = require('../controllers/questions');
const Answers = require('../controllers/answers');


module.exports = function (app) {
    app.get('/clients', Clients.index);
    app.post('/clients', Clients.create);
    app.delete('/clients', Clients.logout);
    app.post('/clients/login', Clients.authenticate);
    app.delete('/clients/:id', Clients.delete);
    app.get('/clients/:id', Clients.show);
    app.put('/clients/:id', Clients.update);
    app.get('/session', Clients.session);

    app.get('/roles', Roles.index);
    app.post('/roles', Roles.create);
    app.delete('/roles/:id', Roles.delete);
    app.get('/roles/:id', Roles.show);
    app.put('/roles/:id', Roles.update);

    app.get('/categories', Categories.index);
    app.post('/categories', Categories.create);
    app.delete('/categories/:id', Categories.delete);
    app.get('/categories/:id', Categories.show);
    app.put('/categories/:id', Categories.update);

    app.get('/surveys', Surveys.index);
    app.post('/surveys', Surveys.create);
    app.delete('/surveys/:id', Surveys.delete);
    app.get('/surveys/:id', Surveys.show);
    app.put('/surveys/:id', Surveys.update);

    app.get('/questions', Questions.index);
    app.post("/questions/:id", Questions.create);
    app.delete('/questions/:id', Questions.delete);
    app.get('/questions/:id', Questions.show);
    app.put('/questions/:id', Questions.update);
    
    app.get('/answers', Answers.index);
    app.post("/answers/:id", Answers.create);
    app.delete('/answers/:id', Answers.delete);
    app.get('/answers/:id', Answers.show);
    app.put('/answers/:id', Answers.update);

    app.get('/users', Users.index);
    app.post('/users', Users.create);
    app.delete('/users/:id', Users.delete);
    app.get('/users/:id', Users.show);
    app.put('/users/:id', Users.update);


    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('./public/dist/index.html'));
    })
}