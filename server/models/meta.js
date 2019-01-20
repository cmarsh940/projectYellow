const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    address: {
        type: String
    },
    agent: {
        type: String
    },
    browser: {
        type: String
    },
    device: {
        type: String
    },
    loc: {
        type: Object
    },
    metaName: {
        type: String
    },
    referer: {
        type: String
    },
    _survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"       
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    _client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
}, { timestamps: true });

const Meta = mongoose.model('Meta', MetaSchema);