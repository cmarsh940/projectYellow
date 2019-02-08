const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    answers: { type: Array, "default": [] },
    isRequired: {
        type: Boolean,
        default: true
    },
    lastAnswered: {
        type: Date
    },
    options:{
        type: [
            {
                _id: false,
                optionName: String
            }
        ]
    },
    question: {
        type: String,
    },
    questionType: {
        type: String
    },
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);