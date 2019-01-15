const mongoose = require("mongoose");
const os = require('os');
const geoip = require('geoip-lite');

const Survey = mongoose.model("Survey");
const Category = mongoose.model('Category');
const Client = mongoose.model('Client');
const Meta = mongoose.model('Meta');
const Question = mongoose.model('Question');
const User = mongoose.model('User');


class SurveysController {
  index(req, res) {
    Survey.find({}).lean()
    .populate({ path: "category", select: 'name', model: Category })
    .populate({ path: "creator", select: 'firstName lastName businessName', model: Client })
    .populate("questions")
    .exec((err, surveys) => {
      if (err) {
        console.log("*** ERROR: FINDING SURVEYS=", err);
        return res.json(err);
      }
      console.log("*** FOUND SURVEYS ***", surveys);
      return res.json(surveys);
    })
  }

  create(req, res) {
    Survey.create(req.body, (err, survey) => {
      if (err) {
        console.log("___ CREATE SURVEY ERROR ___", err);
        return res.json(err);
      }

      // PUSH SURVEY ID LINKING QUESTION TO THE SURVEY
      var array = req.body.questions;
      for (let index = 0; index < array.length; index++) {
        array[index]._survey = survey._id;
      }

      // CREATE QUESTIONS
      Question.create(array, function (err, questions) {
        if (err) {
          console.log("___ CREATE SURVEY QUESTION ERROR ___", err);
          return res.json(err);
        }

        // PUSH SURVEY ID INTO CLIENTS SURVEY ARRAY
        Client.findByIdAndUpdate(req.body.creator, { $push: { _surveys: survey._id }, $inc: { surveyCount: -1 } }, { new: true }, (err, client) => {
          if (err) {
            console.log("___ CREATE SURVEY CLIENT ERROR ___", err);
            return res.json(err);
          } 

          // PUSH SURVEY ID INTO SAME SURVEY CATEGORY ARRAY
          Category.findByIdAndUpdate(req.body.category, { $push: { _surveys: survey._id } }, { new: true }, (err, category) => {
            if (err) {
              console.log("___ CREATE SURVEY CATEGORY ERROR ___", err);
              return res.json(err);
            } 

            // PUSH QUESTIONS INTO SURVEY
            for (let index = 0; index < questions.length; index++) {
              survey.questions.push(questions[index]._id);
            }
            survey.save((err, survey) => {
              if (err) {
                console.log("___ CREATE SURVEY PUSH QUESTIONS ERROR ___", err);
                return res.json(err);
              }
              console.log("___ CREATED SURVEY ___", survey);
              return res.json(survey);
            })
          })
        })
      })
    })
  }

  show(req, res) {
    Survey.findById({ _id: req.params.id }).lean()
      .select("+meta")
      .populate({ path: 'creator', select: 'firstName', select: '_subscription', model: Client })
      .populate("questions")
      .populate({ path: 'meta', select: 'browser device loc', model: Meta})
      .exec((err, survey) => {
        if (err) {
          console.log("*** ERROR: FINDING SURVEY ***", err);
          return res.json(err);
        }
        console.log("*** FOUND SURVEY ***", survey);
        return res.json(survey);
    });
  }


  answerSurvey(req, res) {
    console.log("*** HIT SERVER UPDATE ANSWER ***");
    
    Survey.findByIdAndUpdate(req.params.id, { 
      $push: { submissionDates: Date.now() },
      $set: { 
        lastSubmission: Date.now(), 
        averageTime: req.body.averageTime,
        totalAnswers: req.body.totalAnswers,
        surveyTime: req.body.surveyTime
      } }, { new: true }, (err, survey) => {
      if (err) {
        console.log("___ UPDATE FINDING SURVEY ERROR ___", err);
        return res.json(err);
      } else {
        var arr = req.body.questions;
        for (let i = 0; i < arr.length; i++) {
          Question.findById(arr[i]._id, (err, question) => {
            if (err) {
              console.log(`___ UPDATE SURVEY QUESTION[${i}] ERROR ___`, err);
              return res.json(err);
            }
            question.answers.push(arr[i].answers)
            question.lastAnswered = Date.now();
            question.save((err, question) => {
              if (err) {
                console.log(`___ SAVE SURVEY QUESTION[${i}] ERROR ___`, err);
                return res.json(err);
              }
              console.log(`___ UPDATED QUESTION[${i}] INSIDE LOOP ___`, question);
            });
          })
        }
        let geo = geoip.lookup(req.ip);
        let meta = {
          address: req.ip,
          agent: req.body.agent,
          loc: geo,
          metaName: os.userInfo().username,
          device: req.body.device,
          browser: req.body.platform,
          _survey: survey._id
        }
        Meta.create(meta, function (err, metas) {
          if (err) {
            console.log("___ CREATE SURVEY QUESTION ERROR ___", err);
            return res.json(err);
          } else {
            console.log("CREATING META SUCCESS" , metas);
            Survey.findByIdAndUpdate(req.params.id, {
              $push: { meta: metas._id }
            }, { new: true }, (err, updatedSurvey) => {
              if (err) {
                console.log("___ UPDATE FINDING SURVEY ERROR ___", err);
                return res.json(err);
              } 
              res.json(updatedSurvey);
            })
          }
        })
      }
    })
  }

  answerPrivateSurvey(req, res) {
    console.log("*** HIT SERVER UPDATE ANSWER ***");
    console.log("*** PARAMS ***", req.params);
    console.log("*** BODY ***", req.body);

    Survey.findByIdAndUpdate(req.params.id, { 
      $push: { submissionDates: Date.now() },
      $set: { 
        lastSubmission: Date.now(), 
        averageTime: req.body.averageTime,
        totalAnswers: req.body.totalAnswers,
        surveyTime: req.body.surveyTime
      } }, { new: true }, (err, survey) => {
      if (err) {
        console.log("___ UPDATE FINDING SURVEY ERROR ___", err);
        return res.json(err);
      } else {
        let arr = req.body.questions;
        let userAnswers = [];
        for (let i = 0; i < arr.length; i++) {
          Question.findById(arr[i]._id, (err, question) => {
            if (err) {
              console.log(`___ UPDATE SURVEY QUESTION[${i}] ERROR ___`, err);
              return res.json(err);
            }
            userAnswers.push(arr[i].answers);
            question.answers.push(arr[i].answers)
            question.lastAnswered = Date.now();
            question.save((err, question) => {
              if (err) {
                console.log(`___ SAVE SURVEY QUESTION[${i}] ERROR ___`, err);
                return res.json(err);
              }
              console.log(`___ UPDATED QUESTION[${i}] INSIDE LOOP ___`, question);
            });
          })
        }
        User.findById(req.body.user, (err, user) => {
          if (err) {
            console.log(`___ UPDATE SURVEY QUESTION[${i}] ERROR ___`, err);
            return res.json(err);
          }
          let geo = geoip.lookup(req.ip);
          let meta = {
            address: req.ip,
            agent: req.body.agent,
            loc: geo,
            metaName: os.userInfo().username,
            device: req.body.device,
            browser: req.body.platform,
            _survey: survey._id,
            _user: user._id
          }
          Meta.create(meta, function (err, metas) {
            if (err) {
              console.log("___ CREATE SURVEY QUESTION ERROR ___", err);
              return res.json(err);
            } else {
              user.answers.push(userAnswers)
              user.submissionDate = Date.now();
              user.answeredSurvey = true;
              user._meta = metas._id;
              user.save((err, savedUser) => {
                if (err) {
                  console.log(`___ SAVE SURVEY QUESTION[${i}] ERROR ___`, err);
                  return res.json(err);
                }
                console.log("SAVED USER", savedUser);
                
                console.log("CREATING USER META SUCCESS", metas);
                Survey.findByIdAndUpdate(req.params.id, {
                  $push: { meta: metas._id }
                }, { new: true }, (err, updatedSurvey) => {
                  if (err) {
                    console.log("___ UPDATE FINDING SURVEY ERROR ___", err);
                    return res.json(err);
                  }
                  res.json(updatedSurvey);
                })
              })
            }
          })
        })
      }
    })
  }

  update(req, res) {
    console.log("*** HIT SERVER UPDATE ***");
    console.log("*** BODY ***", req.body);

    Survey.findById(req.params.id, (err, survey) => {
      if (err) {
        console.log("___ UPDATE FINDING SURVEY ERROR ___", err);
        return res.json(err);
      } else {
        var arr = req.body.questions;
        console.log("___ ARRAY OF QUESTIONS TO UPDATE ___", arr);

        for (let i = 0; i < arr.length; i++) {
          Question.findById(arr[i]._id, (err, question) => {
            if (err) {
              console.log(`___ UPDATE SURVEY QUESTION[${i}] ERROR ___`, err);
              return res.json(err);
            }
            if (arr[i]._id == null) {
              Question.create(arr[i], function (err, newQuestion) {
                if (err) {
                  console.log("___ CREATE SURVEY QUESTION ERROR ___", err);
                  return res.json(err);
                }

                // PUSH SURVEY ID INTO CLIENTS SURVEY ARRAY
                Survey.findByIdAndUpdate(req.body._id, { $push: { questions: newQuestion._id } }, { new: true }, (err, survey) => {
                  if (err) {
                    console.log("___ CREATE SURVEY CLIENT ERROR ___", err);
                    return res.json(err);
                  }
                })
              })
            } else {
              question.question = arr[i].question;
              question.questionType = arr[i].questionType;
              question.save((err, question) => {
                if (err) {
                  console.log(`___ SAVE SURVEY QUESTION[${i}] ERROR ___`, err);
                  return res.json(err);
                }
                console.log(`___ UPDATED QUESTION[${i}] ___`, question);
              });
            }
          })
        }
        survey.private = req.body.private;
        survey.name = req.body.name;
        survey.category = req.body.category;
        survey.save((err, updatedSurvey) => {
          if (err) {
            console.log("___  SURVEY ERROR ___", err);
            return res.json(err);
          }
          console.log("___  UPDATED SURVEY ___", updatedSurvey);
          return res.json(updatedSurvey);
        })
      }
    })
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
