const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [200, "First name cannot be greater then 200 characters"]
    },
    email: {
        type: String,
        minlength: [5, "Email did not meat the requirments"],
        maxlength: [200, "Email cannot be greater then 200 characters"],
        trim: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: "Please enter your email in the correct format."
        }
    },
    phone: {
        type: Number,
        unique: true
    },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    answers: [String],
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);