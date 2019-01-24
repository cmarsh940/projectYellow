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

  grt: {
    type: String
  },

  phone: {
    type: String,
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

  address: {
    type: String,
  },

  city: {
    type: String,
    trim: true
  },

  state: {
    type: String,
    trim: true
  },

  zip: {
    type: Number,
  },

  password: {
    type: String,
    required: [true, "Password cannot be blank"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [150, "Password cannot be greater then 150 characters"],
    select: false,
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

  registerPlatform: {
    type: String,
    enum: ['EMAIL', 'FACEBOOK', 'GOOGLE'],
    required: true,
    uppercase: true,
    select: false,
    trim: true,
    default: "EMAIL"
  },

  platformId: {
    type: String
  },

  platformAuth: {
    type: String
  },

  role: {
    type: String,
    enum: ['CLIENT', 'SKIPPER', 'CAPTAIN'],
    required: true,
    uppercase: true,
    trim: true,
    default: "CLIENT"
  },
  
  lastUseDate: {
    type: Date
  },
  
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now()
  },

  paidThroughDate: {
    type: Date
  },

  paymentToken: {
    type: String
  },

  datesPaid:{
    type: Array
  },
  
  permissionLevel: {
    type: Number,
    default: 1
  },

  billingCycle: {
    type: Number,
    enum: [1, 12]
  },

  _subscription: {
    type: String,
    enum: ['FREE', 'BASIC', 'PRO', 'ELITE', 'CANCELED'],
    required: true,
    uppercase: true,
    trim: true,
    default: 'FREE'
  },

  subscriptionId: {
    type: String,
    default: ""
  },

  subscriptionStatus: {
    type: String,
    default: "Trial",
  },

  surveyCount: {
    type: Number,
    default: 5
  },
  
  _surveys: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
      }
    ],
    default: []
  },
  _meta: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meta"
      }
    ],
    default: []
  },

  users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    default: []
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  
  resetRequest: {
    type: Boolean,
    required: true,
    default: false
  },
  resetDates: { type: Array, "default": [] },

}, {
    timestamps: true
  });

// Uniqueness
ClientSchema.plugin(unique, { message: "Email'{VALUE}' already exists." });

ClientSchema.pre('save', function (next) {
  let client = this;

  if (client.isNew) {
    client.password = bcrypt.hashSync(client.password, bcrypt.genSaltSync());
    client.grt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (client.registerPlatform === "FACEBOOK") {
      client.verified = true;
    }
  }

  next();
});


ClientSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
}

const Client = mongoose.model('Client', ClientSchema);


module.exports.getClientById = function (id, callback) {
  Client.findById(id, callback);
}