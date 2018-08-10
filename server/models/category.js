const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    surveys: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Survey"
            }
        ],
        default: []
    }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);