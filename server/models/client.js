const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
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
        validator: function(email) {
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
    _answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }]
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', ClientSchema);