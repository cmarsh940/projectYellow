const mongoose = require('mongoose');

const IncentiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    drawDate: {
        type: Date,
        required: true
    },
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        select: false,
        default: []
    },
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    },
    winner: {
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        select: false
    }
}, { timestamps: true });

const Incentive = mongoose.model('Incentive', IncentiveSchema);