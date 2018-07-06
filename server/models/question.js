const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, "Type of question cannot be blank"],
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