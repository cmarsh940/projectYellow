const mongoose = require("mongoose");
const Survey = mongoose.model("Survey");
const Category = mongoose.model('Category');
const Client = mongoose.model('Client');
const Question = mongoose.model('Question');

class SurveysController {
  index(req, res) {
    Survey.find({}).lean().populate(
      { path: "category", select: 'name', model: Category }).populate(
      { path: "creator", model: Client }
  ).exec((err, surveys) => {
      if (err) {
        console.log("*** ERROR: FINDING SURVEYS=", err);
        return res.json(err);
      }
      console.log("*** FOUND SURVEYS ***", surveys);
      return res.json(surveys);
    });
  }

  create(req, res) {
    console.log("______ SERVER HIT CREATE SURVEY ______");
    console.log("______ req.body ______", req.body);
    Survey.create(req.body, (err, survey) => {
      if (err) {
        console.log("___ CREATE SURVEY ERROR ___", err);
        return res.json(err);
      }
      var array = req.body.questions;
      for (let index = 0; index < array.length; index++) {
        array[index]._survey = survey._id;
      }
      Question.create(array, function (err, questions) {
        if (err) {
          console.log("___ CREATE Question ERROR ___", err);
          return res.json(err);
        }
        console.log("___ UPDATED QUESTIONS W? SURVEYID", questions);
        Client.findByIdAndUpdate(req.body.creator, { $push: { surveys: survey._id } }, { new: true }, (err, client) => {
          if (err) {
            console.log("___ CREATE SURVEY CLIENT ERROR ___", err);
            return res.json(err);
          } 
          Category.findByIdAndUpdate(req.body.category._id, { $push: { surveys: survey._id } }, { new: true }, (err, category) => {
            if (err) {
              console.log("___ CREATE SURVEY  CATEGORY ERROR ___", err);
              return res.json(err);
            }
            for (let index = 0; index < questions.length; index++) {
              survey.questions.push(questions[index]._id);
            }
            survey.save((err, survey) => {
              if (err) {
                console.log("___ CREATE SURVEY PUSH QUESTIONS ERROR ___", err);
                return res.json(err);
              }
              console.log("___ CREATE SURVEY ___", survey);
              return res.json(survey);
            })
          })
        })
      })
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

    Survey.findByIdAndUpdate(req.params.id,
      { $push: { "questions.$[].answers": { answer: req.body.answer } } },
      { safe: true, upsert: true, new: true },
      function (err, survey) {
        if(err){
          console.log("___ ANSWER SURVEY ERROR ___", err);
          return res.json(err);
        } else {
          console.log("___ ANSWER SURVEY ___", survey);
          return res.json(survey);
        }
      })
    }
  

  update(req, res) {
    console.log("*** HIT SERVER UPDATE ***");

    Survey.findByIdAndUpdate(req.params.id, req.body, (err, survey) => {
      if (err) {
        console.log("___ CREATE SURVEY ERROR ___", err);
        return res.json(err);
      } else {
        console.log("___ CREATE SURVEY ___", survey);
        return res.json(survey);
      }
    })
  }

  // update(req, res) {
  //   console.log("*** HIT SERVER UPDATE ***");
  //   console.log("*** BODY ***", req.body);

  //   Survey.findByIdAndUpdate(
  //   { _id: req.params.id },
  //   {
  //     $set: {
  //       questions: {
  //         $each: [{ question: req.body.question }]
  //      }
  //    }
  //     })
  //     .then(data => {
  //       console.log("Updated survey", data)
  //       res.json(data)
  //     })
  //     .catch(err => res.json(err))
  // }
  

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
