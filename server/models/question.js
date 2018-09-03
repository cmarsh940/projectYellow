const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
    {
        questionType: {
            type: String
        },
        question: {
            type: String,
            required: [true, "Question cannot be blank"],
            trim: true
        },
        answer: {
            type: String,
            default: ''
        },
    },
    { timestamps: true }
);

const Question = mongoose.model('Question', QuestionSchema);