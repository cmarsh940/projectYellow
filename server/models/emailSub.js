const mongoose = require('mongoose');

const EmailSubSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email cannot be blank'],
        minlength: [5, "Email did not meat the requirments"],
        maxlength: [200, "Email cannot be greater then 200 characters"],
        trim: true,
        unique: [true, 'You are already subscribed'],
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: "Please enter a valid email"
        }
    },
}, { timestamps: true });

const EmailSub = mongoose.model('EmailSub', EmailSubSchema);