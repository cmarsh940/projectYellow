const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    answers: [String],
    name: {
        type: String,
        maxlength: [200, "First name cannot be greater then 200 characters"],
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
        validate: {
            validator: function (phone) {
                return /^\+?[1-9]\d{1,14}$/.test(phone);
            },
            message: "Please enter a valid phone number"
        }
        
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
    loc: { 
        type: String, 
        coordinates: [Number] 
    },
    surveyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);