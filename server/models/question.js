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
        _answer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        },
    },
    { timestamps: true }
);

const Question = mongoose.model('Question', QuestionSchema);