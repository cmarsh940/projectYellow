const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Survey = mongoose.model("Survey");
const User = mongoose.model("User");


class ClientsController {
  index(req, res) {
    Client.find({}).populate('connections.item').exec((err, clients) => {
      if (err) {
        return res.json(err);
      }
      return res.json(clients);
    });
  }
  // index(req, res) {
  //   Client.find({}).populate(
  //     { path: "surveys", model: Survey },
  //     { path: "users", model: User }
  //   ).exec((err, clients) => {
  //     if (err) {
  //       return res.json(err);
  //     }
  //     return res.json(clients);
  //   });
  // }

  create(req, res) {
    console.log("*** SERVER HIT CREATE CLIENT")
    if (req.body.password != req.body.password_confirmation) {
      return res.json({
        errors: {
          password: {
            message: "Your passwords do not match"
          }
        }
      })
    }
    Client.create(req.body, (err, client) => {
      console.log("*** SERVER CREATING CLIENT")
      if (err) {
        console.log("*** SERVER CREATING ERROR", err);
        return res.json(err);
      }
      console.log("*** SERVER CLIENT CREATED", client);
      return res.json(client)
    })
  }
  // create(req, res) {
  //   console.log("*** SERVER HIT CREATE CLIENT")
  //   if (req.body.password != req.body.password_confirmation) {
  //     return res.json({
  //       errors: {
  //         password: {
  //           message: "Your passwords do not match"
  //         }
  //       }
  //     })
  //   }
  //   Client.create(req.body, (err, client) => {
  //     console.log("*** SERVER CREATING CLIENT")
  //     if (err) {
  //       console.log("*** SERVER CREATING ERROR", err);
  //       return res.json(err);
  //     }
  //     let fullName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1) + " " + req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1);
  //     req.session.client = {
  //       _id: client._id,
  //       name: fullName,
  //       surveys: client.surveys
  //     };
  //     return res.json(client)
  //   })
  // }

  authenticate(req, res) {
    Client.findOne({ email: req.body.email }).populate('connections.item').exec((err, client) => {
      if (err) {
        console.log("*** AUTHENTICATE ERROR", err);
        return res.json(err);
      }
      if (client && client.authenticate(req.body.password)) {
        let fullName = client.firstName.toUpperCase() + " " + client.lastName.toUpperCase();
        req.session.client = {
          _id: client._id,
          name: fullName,
          surveys: client.surveys
        };
        return res.json(client)
      }
      return res.json({
        errors: {
          login: {
            message: "email or password is not correct."
          }
        }
      });
    });
  }

  // show(req, res) {
  //   Client.findById({ _id: req.params.id }).populate('connections.item').exec((err, client) => {
  //     if (err) {
  //       return res.json(err);
  //     }
  //     return res.json(client);
  //   });
  // }
  show(req, res) {
    Client.findById({ _id: req.params.id }).lean()
      .populate('surveys')
      .exec(function (err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
  }

  update(req, res) {
    Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, client) => {
        if (err) {
          return res.json(err);
        }
        return res.json(client);
      }
    );
  }

  session(req, res) {
    if (req.session.client_id) {
      Client.findById(req.session.client_id, (err, client) => {
        if (err) {
          return res.json(err);
        }
        return res.json(client);
      });
    } else {
      return res.json({ status: false });
    }
  }

  logout(req, res) {
    delete req.session.client_id;
    return res.json({ status: true });
  }

  delete(req, res) {
    Client.findByIdAndRemove(req.params.id, (err, client) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    })
  }
}

module.exports = new ClientsController();
