const mongoose = require('mongoose');

const ResetRequestSchema = new mongoose.Schema({
    token: {
        type: Number,
        required: true
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    _client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
}, { timestamps: true });

const ResetRequest = mongoose.model('ResetRequest', ResetRequestSchema);