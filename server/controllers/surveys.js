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
          console.log("*** ERROR: FINDING SURVEY ***", err);
          return res.json(err);
        }
        console.log("*** FOUND SURVEY ***", survey);
        return res.json(survey);
    });
  }


  // answerSurvey(req, res) {
  //   console.log("___ HIT SERVER UPDATE ANSWER ___");
  //   console.log("___ BODY ___", req.body);
  //   Survey.findById(req.params.id, function (err, survey) {
  //     if (err) {
  //       console.log("*** ERROR UPDATING SURVEY  ***", err);
  //       return res.json(err);
  //     }

  //     survey.questions.set({ answer: req.body.answer.value });
  //     survey.save(function (err, updatedSurvey) {
  //       if (err) {
  //         console.log("*** ERROR UPDATING SURVEY  ***", err);
  //         return res.json(err);
  //       }
  //       console.log("*** UPDATED SURVEY ***", updatedSurvey);
  //       return res.send(updatedSurvey);
  //     });
  //   });
  // }
  answerSurvey(req, res) {
    console.log("*** HIT SERVER UPDATE ANSWER ***");
    console.log("*** PARAMS ***", req.params);
    console.log("*** BODY ***", req.body);
    Survey.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          "questions.$[].answer.$[]": { $each: req.body.answer }
        }
      },
      {
        "new": true,
      } )
      .then(data => {
        console.log("Updated survey", data)
        res.json(data)
      })
      .catch(err => res.json(err))
  }

  // update(req, res) {
  //   console.log("*** HIT SERVER UPDATE ***");

  //   Survey.findOneAndUpdate(
  //     { "_id": req.params.id },
  //     {
  //       "$push": {
  //         "questions.$[].": { "$each":  }
  //       }
  //     },
  //     {
  //       "new": true,
  //     }
  //   );
  // }
  update(req, res) {
    console.log("*** HIT SERVER UPDATE ***");

    Survey.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        questions: {
          $each: [{ question: req.body.question }]
       }
     }
      })
      .then(data => {
        console.log("Updated survey", data)
        res.json(data)
      })
      .catch(err => res.json(err))
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
