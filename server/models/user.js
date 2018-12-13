const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [200, "First name cannot be greater then 200 characters"]
    },
    email: {
        type: String,
        maxlength: [200, "Email cannot be greater then 200 characters"],
        trim: true,
        validate: {
            validator: function (email) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: "Please enter the email in the correct format."
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number cannot be blank'],
        trim: true,
        minlength: 10,
        maxlength: 12,
        lowercase: true,
        validate: {
            validator: function (phone) {
                return /^\+?[1-9]\d{1,14}$/.test(phone);
            },
            message: "Please enter a valid phone number"
        }
        
    },
    surveyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    answers: [String],
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);