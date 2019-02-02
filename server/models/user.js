const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    answers: [String],
    name: {
        type: String,
        maxlength: [250, "Name cannot be greater then 250 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 12,
        lowercase: true,
    },
    textSent: {
        type: Boolean,
        required: true,
        default: false
    },
    answeredSurvey: {
        type: Boolean,
        required: true,
        default: false
    },
    messageSID: {
        type: String
    },
    submissionDate: {
        type: Date
    },
    private: {
        type: Boolean,
        default: false
    },
    _meta: { type: mongoose.Schema.Types.ObjectId, ref: "Meta" },
    surveyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);