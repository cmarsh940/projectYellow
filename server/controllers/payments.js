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
            return token;
        });
    }

    checkout(req, res) {
        var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        // Use the payment method nonce here
        var nonceFromTheClient = req.body.paymentMethodNonce;
        // Create a new transaction for $10
        var newTransaction = gateway.transaction.sale({
            amount: req.body.chargeAmount,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                // This option requests the funds from the transaction
                // once it has been authorized successfully
                submitForSettlement: true
            }
        }, function (err, result) {
            if (result) {
                return res.json(result);
            } else {
                return res.json(err);
            }
        });
    }


}

module.exports = new PaymentsController();
