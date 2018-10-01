const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const unique = require('mongoose-unique-validator');

const root = 'https://surveysbyme.s3.us-west-2.amazonaws.com/Profile/';

const ClientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name cannot be blank'],
    maxlength: [250, "Max characters reached. please stay below 250 characters"],
    trim: true,
    validate: {
      validator: function (name) {
        return /^[a-zA-Z]+$/.test(name);
      },
      message: "First name cannot contain numbers or symbols."
    }
  },

  lastName: {
    type: String,
    required: [true, 'Last name cannot be blank'],
    maxlength: [250, "Max characters reached. please stay below 250 characters"],
    trim: true,
    validate: {
      validator: function (name) {
        return /^[a-zA-Z]+$/.test(name);
      },
      message: "Last name cannot contain numbers or symbols."
    }
  },

  businessName: {
    type: String,
    trim:true
  },

  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
    minlength: [5, "Email did not meat the requirments"],
    maxlength: [200, "Email cannot be greater then 200 characters"],
    trim: true,
    unique: true,
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
    required: [true, 'Phone number cannot be blank'],
    trim: true,
    minlength: 10,
    maxlength: 12,
  },

  address: {
    type: String,
    required: [true, 'Address cannot be blank'],
  },

  city: {
    type: String,
    required: [true, 'City cannot be blank'],
    trim: true
  },

  state: {
    type: String,
    required: [true, 'State cannot be blank'],
  },

  zip: {
    type: Number,
    required: [true, 'Zip code cannot be blank'],
  },

  password: {
    type: String,
    required: [true, "Password cannot be blank"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [50, "Password cannot be greater then 50 characters"],
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,50}/.test(value);
      },
      message: "Password must have at least 1 number, and 1 uppercase"
    }
  },

  picture: {
    type: String,
    get: v => `${root}${v}`
  },

  role: {
    type: String,
    enum: ['CLIENT', 'SKIPPER', 'CAPTAIN'],
    required: true,
    uppercase: true,
    trim: true,
    default: "CLIENT"
  },
  
  subscription: {
    type: String,
    enum: ['FREE', 'BASIC', 'PRO', 'ELITE'],
    required: true,
    uppercase: true,
    trim: true,
    default: "FREE"
  },

  surveys: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
      }
    ],
    default: []
  },
  
  used: [String],

  users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    default: []
  },

  grt:{
    type: String
  },

  verified: {
    type: Boolean,
    required: true,
    default: true
  }

}, {
    timestamps: true
  });

// Uniqueness
ClientSchema.plugin(unique, { message: "Email'{VALUE}' already exists." });

ClientSchema.pre('save', function (next) {
  let client = this;

  if (client.isNew) {
    client.password = bcrypt.hashSync(client.password, bcrypt.genSaltSync());
  }

  next();
});


ClientSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
}

ClientSchema.methods.setValidate = function (next) {
  let client = this;

  if (client.isNew) {
    client.grt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  next();
}

const Client = mongoose.model('Client', ClientSchema);