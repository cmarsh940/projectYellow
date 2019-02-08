const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    answeredSurvey: {
        type: Boolean,
        required: true,
        default: false
    },
    answers: [String],
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    emailSent:{
        type: Boolean,
        default: false
    },
    messageSID: {
        type: String
    },
    name: {
        type: String,
        maxlength: [250, "Name cannot be greater then 250 characters"],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 12,
        lowercase: true,
    },
    submissionDate: {
        type: Date
    },
    surveyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    textSent: {
        type: Boolean,
        required: true,
        default: false
    },
    private: {
        type: Boolean,
        default: false
    },
    _meta: { type: mongoose.Schema.Types.ObjectId, ref: "Meta" },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" }
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);