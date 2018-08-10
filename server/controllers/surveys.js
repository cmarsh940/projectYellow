const mongoose = require("mongoose");
const Survey = mongoose.model("Survey");
const Category = mongoose.model('Category');

class SurveysController {
  index(req, res) {
    Survey.find({}).populate({ path: "categories", select: 'name', model: Category }).exec((err, surveys) => {
      if (err) {
        console.log("*** ERROR: FINDING SURVEYS=", err);
        return res.json(err);
      }
      console.log("*** FOUND SURVEYS ***", surveys);
      return res.json(surveys);
    });
  }

  create(req, res) {
    Survey.create(req.body, (err, survey) => {
      if (err) {
        console.log("*** ERROR: CREATING SURVEY=", err);
        return res.json(err);
      }
      console.log("*** CREATED SURVEY ***", survey);
      return res.json(survey);
    });
  }

  show(req, res) {
    Survey.findById({ _id: req.params.id })
      .populate({ path: "category", model: Category })
      .exec((err, survey) => {
        if (err) {
          console.log("*** ERROR: FINDING SURVEYS=", err);
          return res.json(err);
        }
        console.log("*** FOUND SURVEYS ***", surveys);
        return res.json(surveys);
    });
  }

  update(req, res) {
    Survey.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, survey) => {
        if (err) {
          console.log("*** ERROR: UPDATING SURVEY=", err);
          return res.json(err);
        }
        console.log("*** SURVEY UPDATED ***", survey);
        return res.json(survey);
      }
    );
  }

  delete(req, res) {
    Survey.findByIdAndRemove(req.params.id, (err, survey) => {
      if (err) {
        console.log("*** ERROR: DELETING SURVEY=", err);
        return res.json(err);
      } else {
        console.log("*** SURVEY DELETED ***");
        return res.json(true);
      }
    });
  }
}

module.exports = new SurveysController();
