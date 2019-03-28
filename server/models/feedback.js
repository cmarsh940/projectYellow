const mongoose = require('mongoose');

const root = 'https://surveysbyme.s3.us-west-2.amazonaws.com/Feedback/';

const FeedbackSchema = new mongoose.Schema({

    email: {
        type: String, 
        maxlength: [200, "Email cannot be greater then 200 characters"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: "Please enter a valid email"
        }
    },

    feedbackType: {
        type: String
    },

    message: {
        type: String,
        required: [true, "Feedback must have a message with it"],
    },

    name: {
        type: String,
        maxlength: [250, "Max characters reached. please stay below 250 characters"],
        trim: true,
    },

    rating: {
        type: Number
    },

    screenshot: {
        type: String,
        get: v => `${root}${v}`
    },
     
    status: {
        type: String,
        enum: ["NEW", "VIEWED", "OPENED", "CLOSED"],
        default: "NEW"
    }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);