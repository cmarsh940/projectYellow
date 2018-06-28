const mongoose = require("mongoose");
const Survey = mongoose.model("Survey");

class SurveysController {
  index(req, res) {
    Survey.find({}, (err, surveys) => {
      if (err) {
        return res.json(err);
      }
      return res.json(surveys);
    });
  }

  create(req, res) {
    Survey.create(req.body, (err, survey) => {
      if (err) {
        return res.json(err);
      }
      return res.json(survey);
    });
  }

  show(req, res) {
    Survey.findById(req.params.id, (err, survey) => {
      if (err) {
        return res.json(err);
      }
      return res.json(survey);
    });
  }

  update(req, res) {
    Survey.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, survey) => {
        if (err) {
          return res.json(err);
        }
        return res.json(survey);
      }
    );
  }

  delete(req, res) {
    Survey.findByIdAndRemove(req.params.id, (err, survey) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    });
  }
}

module.exports = new SurveysController();
