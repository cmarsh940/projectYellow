const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    viewed: {
        type: Boolean,
        required: true,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    viewedDate: {
        Date
    },
    _client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);