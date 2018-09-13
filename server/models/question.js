const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    answers: [String],
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    },
    question: {
        type: String,
    },
    options: {
        type: [
            {
               name: {
                   type: String
               } 
            }
        ]
    },
    questionType: {
        type: String
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);