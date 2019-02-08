const mongoose = require('mongoose');

const IncentiveSchema = new mongoose.Schema({
    drawDate: {
        type: Date,
        required: true
    },
    name: {
        type: String,
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
    winner: {
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        select: false
    },
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    }
}, { timestamps: true });

const Incentive = mongoose.model('Incentive', IncentiveSchema);