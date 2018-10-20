const mongoose = require('mongoose');
const braintree = require('braintree');
// const Client = mongoose.model('Client');
const config = require("../config/config");
const token = String



class PaymentsController {

    getClientToken(req, res) {
        console.log("___ SERVER GET CLIENT TOKEN HIT ___");
        var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        gateway.clientToken.generate({}, function (err, token) {
            if(err) {
                console.log("___ ERROR GETTING TOKEN ___", err);
                return res.json(err);
            }

    
            console.log("TOKEN",token);
            return res.json(token);
        });
    }

    checkout(req, res) {
        console.log("___ HIT SERVER CHECKOUT ___");
        console.log("___ req ___", req.body);
        var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        // Use the payment method nonce here
        var nonceFromTheClient = req.body.payment_method_nonce;
        // Create a new transaction for $10
        var subscription_id = req.body.subscription_id;
        console.log("SERVER SUBSCRIPTION ID", subscription_id);
        if (req.body.subscription_id) {
            if (req.body.subscription_id == '1') {
                var paymentAmount = "30.00"
                console.log("PAYMENT AMOUNT", paymentAmount);
            }
            if(req.body.subscription_id == '2') {
                var paymentAmount = "35.00"
                console.log("PAYMENT AMOUNT", paymentAmount);
            }
            if(req.body.subscription_id == '3') {
                var paymentAmount = "99.00"
                console.log("PAYMENT AMOUNT", paymentAmount);
            }
        }
        else {
            console.log("NO SUBSCRIPTION FOUND");
            return res.json("NO SUBSCRIPTION");
        }
        console.log("AMOUNT", paymentAmount);
        newTransaction = gateway.transaction.sale({
            amount: paymentAmount,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                // This option requests the funds from the transaction
                // once it has been authorized successfully
                submitForSettlement: true
            }
        }, function (err, result) {
            if (result) {
                console.log("RESULT", result);
                return res.json(result);
            } else {
                console.log("PAYMENT ERROR", err);
                return res.json(err);
            }
        });
    }


}

module.exports = new PaymentsController();
