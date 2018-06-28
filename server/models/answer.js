const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema(
    {
        answer: {
            type: String,
            required: [true, "Answer cannot be blank"],
        },
        _client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        }
    },
    { timestamps: true }
);

const Answer = mongoose.model('Answer', AnswerSchema);