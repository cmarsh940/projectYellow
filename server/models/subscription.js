const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
    {
        _clients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Client"
            }
        ],
        name: {
            type: String,
            enum: ['FREE', 'BASIC', 'PRO', 'ELITE'],
            required: true,
            uppercase: true,
            trim: true,
            default: "FREE"
        },
        responses: {
            type: Number,
            required: true,
            default: 1000
        },
        support: {
            type: String,
            enum: ['FREE', 'BASIC', 'PRO', 'ELITE'],
            required: true,
            uppercase: true,
            trim: true,
            default: "FREE"
        },
        surveyCount:{
            type: Number,
            required: true
        },
        text: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);