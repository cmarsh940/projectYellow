const mongoose = require('mongoose');
const User = mongoose.model('User');
const Client = mongoose.model('Client');
const Survey = mongoose.model('Survey');

class UsersController {
    report(req, res) {
        User.find({}).exec((err, users) => {
            if (err) {
                return res.json(err);
            }
            return res.json(users);
        });
    }

    
    create(req, res) {
        User.create(req.body, (err, user) => {
            console.log("*** SERVER CREATING USER")
            if (err) {
                console.log("*** SERVER CREATING ERROR", err);
                return res.json(err);
            }
            console.log("CREATED USER")
            Client.findByIdAndUpdate(req.body.surveyOwner, { $push: { users: user._id } }, { new: true }, (err, client) => {
                if (err) {
                    console.log("___ PUSHING USER TO CLIENT ERROR ___", err);
                    return res.json(err);
                }
                Survey.findByIdAndUpdate(req.body._survey, { $push: { users: user._id } }, { new: true }, (err, survey) => {
                    if (err) {
                        console.log("___ PUSHING USER TO SURVEY ERROR ___", err);
                        return res.json(err);
                    }
                    return res.json(user)
                })
            })
        })
    }

    upload(req, res) {

        let users = req.body;
        for (const user of users) {
            
            User.create(user, (err, user) => {
                console.log("*** SERVER CREATING USER")
                if (err) {
                    console.log("*** SERVER CREATING ERROR", err);
                    return res.json(err);
                }
                console.log("CREATED USER")
                Client.findByIdAndUpdate(user.surveyOwner, { $push: { users: user._id } }, { new: true }, (err, client) => {
                    if (err) {
                        console.log("___ PUSHING USER TO CLIENT ERROR ___", err);
                        return res.json(err);
                    }
                    Survey.findByIdAndUpdate(req.params.id, { $push: { users: user._id } }, { new: true }, (err, survey) => {
                        if (err) {
                            console.log("___ PUSHING USER TO SURVEY ERROR ___", err);
                            return res.json(err);
                        }
                        console.log("FINISHED CREATING USER");
                    })
                })
            })
        }
        return res.json(users);
    }


    showClientsUsers(req, res) {
        console.log("*** HIT SHOW CLIENTS USERS ***");
        Survey.findById({ _id: req.params.id }).lean()
            .populate('users')
            .exec(function (err, doc) {
                if (err) {
                    console.log("ERROR FINDING CLIENT AND POPULATING USERS", err);
                    return res.json(err); 
                }
                
                let clientsUsers = {
                    'id': doc._id,
                    'users': doc.users,
                    'private': doc.private
                }
                console.log("RETURNING CLIENTS USERS");
                return res.json(clientsUsers);
            });
    }

    show(req, res) {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                console.log("ERROR FINDING USER", err);
                return res.json(err);
            }
            return res.json(user);
        });
    }

    update(req, res) {
        User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, user) => {
                if (err) {
                    console.log("ERROR UPDATING USER", err);
                    return res.json(err);
                }
                console.log("RETURNING UPDATED USER");
                return res.json(user);
            }
        );
    }

    delete(req, res) {
        User.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new UsersController();
