const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  name: {
    type: String,
    required: [true, "Survey name cannot be blank"]
  },
  questions: [
    {
      questionType: {
        type: String
      },
      question: {
        type: String,
        required: [true, "Qustion cannot be blank"]
      },
      answer: {
        type: String
      }
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Survey = mongoose.model('Survey', SurveySchema); 