const mongoose = require("mongoose");
const Survey = mongoose.model("Survey");
const Category = mongoose.model('Category');
const Client = mongoose.model('Client');

class SurveysController {
  index(req, res) {
    Survey.find({}).populate('connections.item').exec((err, surveys) => {
      if (err) {
        console.log("*** ERROR: FINDING SURVEYS=", err);
        return res.json(err);
      }
      console.log("*** FOUND SURVEYS ***", surveys);
      return res.json(surveys);
    });
  }
  // index(req, res) {
  //   Survey.find({}).populate(
  //     { path: "category", select: 'name', model: Category },
  //     { path: "owner", model: Client },
  // ).exec((err, surveys) => {
  //     if (err) {
  //       console.log("*** ERROR: FINDING SURVEYS=", err);
  //       return res.json(err);
  //     }
  //     console.log("*** FOUND SURVEYS ***", surveys);
  //     return res.json(surveys);
  //   });
  // }

  create(req, res) {
    console.log("______ SERVER HIT CREATE SURVEY ______");
    Survey.create(req.body, (err, survey) => {
      if (err) {
        return res.json(err);
      } else {
        Client.findByIdAndUpdate(req.body.creator, { $push: { surveys: survey._id } }, { new: true }, (err, client) => {
          if (err) {
            return res.json(err);
          } else {
            Category.findByIdAndUpdate(req.body.category._id, { $push: { surveys: survey._id } }, { new: true }, (err, category) => {
              if (err) {
                console.log(err);
                return res.json(err);
              } else {
                return res.json(survey);
              }
            })
          }
        })
      }
    })
  }

  show(req, res) {
    Survey.findById({ _id: req.params.id }).lean().populate({ path: 'creator', select: 'firstName', model: Client }).exec((err, survey) => {
        if (err) {
          console.log("*** ERROR: FINDING SURVEY =", err);
          return res.json(err);
        }
        console.log("*** FOUND SURVEY ***", survey);
        return res.json(survey);
    });
  }
  // show(req, res) {
  //   Survey.findById({ _id: req.params.id }).lean()
  //     .populate('creator')
  //     .exec(function (err, doc) {
  //       if (err) {
  //         console.log("*** ERROR: FINDING SURVEY =", err);
  //         return res.json(err);
  //       }
  //       console.log("*** FOUND SURVEY ***", doc);
  //       return res.json(doc);
  //   });
  // }

  // updateAnswer(req, res) {
  //   console.log("___ HIT SERVER UPDATE ANSWER ___");
  //   console.log("___ BODY ___", req.body);
  //   Survey.findOneAndUpdate(
  //     { _id: req.body._id, "questions._id": req.body.questions._id },
  //     { $push: { "questions.0.answer": req.body.questions.answer } }).exec((err, survey) => {
  //     if (err) {
  //       console.log("*** ERROR: UPDATING SURVEY=", err);
  //       return res.json(err);
  //     }
  //     console.log("*** SURVEY UPDATED ***", survey);
  //     return res.json(survey);
  //   }
  //   );
  // }
  updateAnswer(req, res) {
    console.log("___ HIT SERVER UPDATE ANSWER ___");
    console.log("___ PARAMS ___", req.params);
    console.log("___ ANSWER ___", req.body.questions[0].answer);
    Survey.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          questions: [{
            $each: { answer: req.body.questions[0].answer }
          }]
        }
      }
    ).exec((err, survey) => {
      if (err) {
        console.log("*** ERROR: UPDATING SURVEY=", err);
        return res.json(err);
      }
      console.log("*** SURVEY UPDATED ***", survey);
      return res.json(survey);
    }
    );
  }

  update(req, res) {
    console.log("___ HIT SERVER UPDATE ___");
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
