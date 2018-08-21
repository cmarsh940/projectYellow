const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name cannot be blank"],
            default: "FREE",
            trim: true
        },
        _clients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Client"
            }
        ]
    },
    { timestamps: true }
);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);