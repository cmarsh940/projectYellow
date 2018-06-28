const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    survey: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey"
    }],
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);