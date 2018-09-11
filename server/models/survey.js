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
  questions: {
    type: [
      {
        questionType: {
          type: String,
          trim: true,
        },
        question: {
          type: String,
          required: [true, "Qustion cannot be blank"]
        },
        answers: {
          type: [
            {
              answer: {
                type: String
              }
            }
          ]
        }
      }
    ]
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
}, {
    timestamps: true
  });

SurveySchema.set('validateBeforeSave', false);

const Survey = mongoose.model('Survey', SurveySchema); 