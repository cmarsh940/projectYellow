const mongoose = require('mongoose');

const ResetRequestSchema = new mongoose.Schema({
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: Number,
        required: true
    },
    _client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
}, { timestamps: true });

const ResetRequest = mongoose.model('ResetRequest', ResetRequestSchema);