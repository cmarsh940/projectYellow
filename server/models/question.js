const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    answers: {
        type: [
            {
                answer: {
                    type: String
                }
            }
        ]
    },
    question: {
        type: String,
    },
    questionType: {
        type: String
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);