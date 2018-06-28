const mongoose = require('mongoose');
const Role = mongoose.model('Role');

class RolesController {
    index(req, res) {
        Role.find({}, (err, roles) => {
            if (err) {
                return res.json(err);
            }
            return res.json(roles);
        });
    }

    create(req, res) {
        Role.create(req.body, (err, role) => {
            if (err) {
                return res.json(err);
            }
            return res.json(role);
        });
    }

    show(req, res) {
        Role.findById(req.params.id, (err, role) => {
            if (err) {
                return res.json(err);
            }
            return res.json(role);
        });
    }

    update(req, res) {
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
        Role.findByIdAndRemove(req.params.id, (err, role) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json(true);
            }
        })
    }
}

module.exports = new RolesController();
