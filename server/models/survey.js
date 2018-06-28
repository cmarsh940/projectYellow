const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Survey name cannot be blank"]
  },
  _questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  _answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer"
  }],
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  _clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    }
  ]
});

const Survey = mongoose.model('Survey', SurveySchema); 