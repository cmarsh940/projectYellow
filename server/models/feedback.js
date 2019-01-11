const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name: {
        type: String, 
        maxlength: [250, "Max characters reached. please stay below 250 characters"],
        trim: true,
        validate: {
            validator: function (name) {
                return /^[a-zA-Z]+$/.test(name);
            },
            message: "First name cannot contain numbers or symbols."
        }
    },
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
    phone: {
        type: Number,
        validate: {
            validator: function (phone) {
                return /^\+?[1-9]\d{1,14}$/.test(phone);
            },
            message: "Please enter a valid phone number"
        }
    },
    message: {
        type: String,
    }   
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);