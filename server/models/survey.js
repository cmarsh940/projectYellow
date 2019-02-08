const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  averageTime: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  experationDate: {
    type: Date
  },
  incentive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incentive"
  },
  lastSubmission: {
    type: Date,
  },
  meta: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meta"
      }
    ],
    default: []
  },
  name: {
    type: String,
    required: [true, "Survey name cannot be blank"],
    trim: true,
  },
  private: {
    type: Boolean,
    required: [true, "Survey privacy cannot be blank"],
    default: false
  },
  questions: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],
    default: []
  },
  submissionDates: [Date],
  surveyTime: {
    type: Number,
    default: 0
  },
  totalAnswers: {
    type: Number,
    default: 0
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {
  timestamps: true
});

SurveySchema.set('validateBeforeSave', false);

const Survey = mongoose.model('Survey', SurveySchema); 