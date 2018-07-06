const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be blank"],
      trim: true
    },
    _client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    },
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', RoleSchema);