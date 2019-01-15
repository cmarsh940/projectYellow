const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  meta: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meta"
      }
    ],
    select: false,
    default: []
  },
  averageTime: {
    type: Number
  },
  totalAnswers: {
    type: Number,
    default: 0
  },
  surveyTime: {
    type: Number,
    default: 0
  },
  submissionDates: [Date],
  lastSubmission: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
    timestamps: true
  });

SurveySchema.set('validateBeforeSave', false);

const Survey = mongoose.model('Survey', SurveySchema); 