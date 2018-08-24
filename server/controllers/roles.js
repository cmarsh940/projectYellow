const mongoose = require('mongoose');
const Role = mongoose.model('Role');

class RolesController {
    index(req, res) {
        console.log("*** SERVER INDEX ROLE ***");
        Role.find({}, (err, roles) => {
            if (err) {
                return res.json(err);
            }
            return res.json(roles);
        });
    }

    create(req, res) {
        console.log("*** SERVER CREATE ROLE ***");
        console.log("*** SERVER REQ ***", req);
        Role.create(req.body, (err, role) => {
            if (err) {
                console.log("*** SERVER CREATE ERROR ***", err);
                return res.json(err);
            }
            console.log("*** SERVER CREATE ROLE ***", role);
            return res.json(role);
        });
    }

    show(req, res) {
        console.log("*** SERVER SHOW ROLE ***");
        Role.findById(req.params.id, (err, role) => {
            if (err) {
                return res.json(err);
            }
            return res.json(role);
        });
    }

    update(req, res) {
        console.log("*** SERVER UPDATE ROLE ***");
        Role.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
            (err, role) => {
                if (err) {
                    return res.json(err);
                }
                return res.json(role);
            }
        );
    }

    delete(req, res) {
        console.log("*** SERVER DELETE ROLE ***");
        Role.findByIdAndRemove(req.params.id, (err, role) => {
            if (err) {
                console.log("*** SERVER ERROR DELETE: ***", err)
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new RolesController();
