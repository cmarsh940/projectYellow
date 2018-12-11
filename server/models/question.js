const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    answers: { type: Array, "default": [] },
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    },
    isRequired: {
        type: Boolean,
        default: true
    },
    question: {
        type: String,
    },
    options:[
        {
            _id: false,
            optionName: String
        }
    ],
    questionType: {
        type: String
    },
    lastAnswered: {
        type: Date
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);