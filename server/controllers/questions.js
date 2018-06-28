const mongoose = require("mongoose");
const Question = mongoose.model("Question");

class QuestionsController {
  index(req, res) {
    Question.find({}, (err, questions) => {
      if (err) {
        return res.json(err);
      }
      return res.json(questions);
    });
  }

  create(req, res) {
    Question.create(req.body, (err, question) => {
      if (err) {
        return res.json(err);
      }
      return res.json(question);
    });
  }

  show(req, res) {
    Question.findById(req.params.id, (err, question) => {
      if (err) {
        return res.json(err);
      }
      return res.json(question);
    });
  }

  update(req, res) {
    Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, question) => {
        if (err) {
          return res.json(err);
        }
        return res.json(question);
      }
    );
  }

  delete(req, res) {
    Question.findByIdAndRemove(req.params.id, (err, question) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    });
  }
}

module.exports = new QuestionsController();
