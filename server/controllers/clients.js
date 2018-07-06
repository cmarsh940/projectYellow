const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Survey = mongoose.model("Survey");
const User = mongoose.model("User");


class ClientsController {
  index(req, res) {
    Client.find({})
      .populate({ path: "surveys", model: Survey })
      .populate({ path: "users", model: User })
      .exec((err, clients) => {
      if (err) {
        return res.json(err);
      }
      return res.json(clients);
    });
    Venue.find({})
      .populate({ path: "amenities", model: Amenity })
      .populate({ path: "reviews", model: Review })
      .populate({ path: "_category", model: Category })
      .exec((err, venues) => {
        if (err) {
          return res.json(err);
        }
        return res.json(venues);
      });
  }

  create(req, res) {
    console.log("*** SERVER CREATING Client")
    if (req.body.password != req.body.password_confirmation) {
      return res.json({
        errors: {
          password: {
            message: 'Your passwords do not match'
          }
        }
      })
    }
    Client.create(req.body, (err, client) => {
      console.log("*** SERVER CREATING Client")
      if (err) {
        console.log("*** SERVER CREATING ERROR", err);
        return res.json(err);
      }
      req.session.client_id = client._id;
      return res.json(client)
    })
  }

  authenticate(req, res) {
    Client.findOne({ email: req.body.email }, (err, client) => {
      if (err) {
        return res.json(err);
      }
      if (client && client.authenticate(req.body.password)) {
        req.session.client_id = client._id;
        return res.json(client);
      }
      return res.json({
        errors: {
          login: {
            message: 'Invalid credentials'
          }
        }
      });
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
