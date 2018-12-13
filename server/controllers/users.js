const mongoose = require('mongoose');
const User = mongoose.model('User');
const Client = mongoose.model('Client');

class UsersController {
    index(req, res) {
        User.find({}, (err, users) => {
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
            console.log("CREATED USER", user)
            Client.findByIdAndUpdate(req.body.surveyOwner, { $push: { users: user._id } }, { new: true }, (err, client) => {
                if (err) {
                    console.log("___ PUSHING USER TO CLIENT ERROR ___", err);
                    return res.json(err);
                }
                console.log("CLIENT", client);
                return res.json(user)
            })
        })
    }


    showClientsUsers(req, res) {
        console.log("*** HIT SHOW CLIENTS USERS ***", req);
        // User.$where('this.').exec(function (err, docs) { });
        Client.findById({ _id: req.params.id }).lean()
            .populate('users')
            .exec(function (err, doc) {
                if (err) {
                    console.log("ERROR FINDING CLIENT AND POPULATING USERS", err);
                    return res.json(err); 
                }
                
                let clientsUsers = doc.users;
                console.log("RETURNING CLIENTS USERS", clientsUsers);
                return res.json(clientsUsers);
            });
    }

    show(req, res) {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                console.log("ERROR FINDING USER", err);
                return res.json(err);
            }
            console.log("RETURNING USER", user);
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
                console.log("RETURNING UPDATED USER", user);
                return res.json(user);
            }
        );
    }

    delete(req, res) {
        User.findByIdAndRemove(req.params.id, (err, user) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new UsersController();
