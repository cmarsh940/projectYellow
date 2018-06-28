const mongoose = require("mongoose");
const Answer = mongoose.model("Answer");

class AnswersController {
  index(req, res) {
    Answer.find({}, (err, answers) => {
      if (err) {
        return res.json(err);
      }
      return res.json(answers);
    });
  }

  create(req, res) {
    Answer.create(req.body, (err, answer) => {
      if (err) {
        return res.json(err);
      }
      return res.json(answer);
    });
  }

  show(req, res) {
    Answer.findById(req.params.id, (err, answer) => {
      if (err) {
        return res.json(err);
      }
      return res.json(answer);
    });
  }

  update(req, res) {
    Answer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, answer) => {
        if (err) {
          return res.json(err);
        }
        return res.json(answer);
      }
    );
  }

  delete(req, res) {
    Answer.findByIdAndRemove(req.params.id, (err, answer) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json(true);
      }
    });
  }
}

module.exports = new AnswersController();
