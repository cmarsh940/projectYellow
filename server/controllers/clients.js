const mongoose = require('mongoose');
const Client = mongoose.model('Client');


class ClientsController {
  index(req, res) {
    Client.find({})
      .exec((err, clients) => {
        if (err) {
          return res.json(err);
        }
        return res.json(clients);
      });
  }

  create(req, res) {
    Client.create(req.body, (err, client) => {
      if (err) {
        return res.json(err);
      }
      return res.json(client);
    });
  }

  show(req, res) {
    Client.findById(req.params.id, (err, client) => {
      if (err) {
        return res.json(err);
      }
      return res.json(client);
    });
  }

  update(req, res) {
    Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, venue) => {
        console.log("*** SERVER REQ", req.body);
        if (err) {
          console.log("*** SERVER ERROR", err);
          return res.json(err);
        }
        console.log("*** SERVER VENUE UPDATE", venue);
        return res.json(venue);
      }
    );
  }

  delete(req, res) {
    Client.findByIdAndRemove(req.params.id, (err, venue) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    });
  }
}

module.exports = new ClientsController();
