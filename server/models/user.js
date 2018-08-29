const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name cannot be blank"],
        maxlength: [200, "First name cannot be greater then 200 characters"]
    },
    LastName: {
        type: String,
        required: [true, "Last name cannot be blank"],
        maxlength: [200, "Last name cannot be greater then 200 characters"]
    },
    email: {
        type: String,
        required: [true, "Email cannot be blank"],
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
        required: [true, "Phone number cannot be blank"],
        unique: true,
    },
    _survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    answers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Answer"
            }
        ],
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const User = mongoose.model('User', UserSchema);