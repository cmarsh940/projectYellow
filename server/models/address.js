const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
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
    postalCode: {
        type: Number,
    },
    _client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
    
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);