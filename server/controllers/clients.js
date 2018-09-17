const mongoose = require('mongoose');
const Client = mongoose.model('Client');

class ClientsController {
  index(req, res) {
    Client.find({}).populate('connections.item').exec((err, clients) => {
      if (err) {
        return res.json(err);
      }
      return res.json(clients);
    });
  }

  create(req, res) {
    console.log("*** SERVER HIT CREATE CLIENT");
    if (req.body.password != req.body.confirm_pass) {
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

  authenticate(req, res) {
    console.log("SERVER HIT AUTHENTICATE");
    Client.findOneAndUpdate({ email: req.body.email }, { $addToSet: { used: req.body.used } }).populate('surveys').exec((err, client) => {
      if (err) {
        console.log("____ AUTHENTICATE ERROR ____", err);
        return res.json("____ AUTHENTICATE ERROR ____" + err);
      }
      if (client && client.authenticate(req.body.password)) {
        console.log("_____CLIENT LOGGING IN_____", client);
        req.session.client = {
          _id: client._id,
          n: client.firstName + " " + client.lastName,
          a8o1: client.role,
          b801: client.subscription,
          s: client.surveys
        };
        return res.json(req.session.client);
      }
    })
  }

  show(req, res) {
    Client.findById({ _id: req.params.id }).lean()
      .populate('surveys')
      .populate('category')
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
