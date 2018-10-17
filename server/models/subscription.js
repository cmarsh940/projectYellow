const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
    {
        _clients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Client"
            }
        ],
        datesPaid: [Date],
        lastPayment: {
            type: Date,
        },
        name: {
            type: String,
            enum: ['FREE', 'BASIC', 'PRO', 'ELITE'],
            required: true,
            uppercase: true,
            trim: true,
            default: "FREE"
        },
        renewPaymentDate: {
            type: Date,
            required: true,
            default: Date.now()
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
            required: true,
            default: 10
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