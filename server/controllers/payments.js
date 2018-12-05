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
            console.log("TOKEN", token);
            gateway.plan.all(function (err, plans) {
                if (err) {
                    console.log("___ ERROR GETTING PLANS ___", err);
                    return res.json(err);
                }
                console.log("PLANS RESULT", plans);
                let results = {token, plans};
                return res.json(results);
            });
            
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

        // SUBMIT TRANSACTION FOR VERIFICATION THROUGH BRAINTREE
        newTransaction = gateway.transaction.sale({
            amount: paymentAmount,
            paymentMethodNonce: nonceFromTheClient,
            customer: {
                id: req.body.currentClient._id,
                firstName: req.body.currentClient.firstName,
                lastName: req.body.currentClient.lastName,
                company: req.body.currentClient.businessName,
                email: req.body.currentClient.email,
                phone: req.body.currentClient.phone,
            },
            billing: {
                firstName: req.body.currentClient.firstName,
                lastName: req.body.currentClient.lastName,
                company: req.body.currentClient.businessName,
                streetAddress: req.body.currentClient.address,
                locality: req.body.currentClient.city,
                region: req.body.currentClient.state,
                postalCode: req.body.currentClient.zip,
                countryCodeAlpha2: "US"
            },
            options: {
                submitForSettlement: true,
                storeInVaultOnSuccess: true
            }
        }, function (err, result) {
            if (err) {
                console.log("PAYMENT ERROR", err);
                return res.json(err);
            } else {
                console.log("PAYMENT", result);
                return res.json(result);
            }
        });
    }

    updatePaymentMethod(req, res){
        let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        // Use the payment method nonce here
        let nonceFromTheClient = req.body.payment_method_nonce;
        gateway.transaction.sale({
            amount: "1.00",
            paymentMethodNonce: nonceFromTheClient,
            customerId: req.body.currentClient._id,
            options: {
                storeInVaultOnSuccess: true
            }
        }, function (err, result) {
        });
    }
    // checkout(req, res) {
    //     console.log("___ HIT SERVER CHECKOUT ___");
    //     console.log("___ req ___", req.body);
    //     var gateway = braintree.connect({
    //         environment: braintree.Environment.Sandbox,
    //         merchantId: config.merchantId,
    //         publicKey: config.publicKey,
    //         privateKey: config.privateKey
    //     });

    //     // Use the payment method nonce here
    //     var nonceFromTheClient = req.body.payment_method_nonce;
    //     // Create a new transaction for $10
    //     var subscription_id = req.body.subscription_id;
    //     console.log("SERVER SUBSCRIPTION ID", subscription_id);
    //     if (req.body.subscription_id) {
    //         if (req.body.subscription_id == '1') {
    //             var paymentAmount = "30.00"
    //             console.log("PAYMENT AMOUNT", paymentAmount);
    //         }
    //         if(req.body.subscription_id == '2') {
    //             var paymentAmount = "35.00"
    //             console.log("PAYMENT AMOUNT", paymentAmount);
    //         }
    //         if(req.body.subscription_id == '3') {
    //             var paymentAmount = "99.00"
    //             console.log("PAYMENT AMOUNT", paymentAmount);
    //         }
    //     }
    //     else {
    //         console.log("NO SUBSCRIPTION FOUND");
    //         return res.json("NO SUBSCRIPTION");
    //     }

    //     // SUBMIT TRANSACTION FOR VERIFICATION THROUGH BRAINTREE
    //     newTransaction = gateway.transaction.sale({
    //         amount: paymentAmount,
    //         paymentMethodNonce: nonceFromTheClient,
    //         options: {
    //             submitForSettlement: true
    //         }
    //     }, function (err, result) {
    //         if (err) {
    //             console.log("PAYMENT ERROR", err);
    //             return res.json(err);
    //         } else {
    //             console.log("PAYMENT", result);
    //             return res.json(result);
    //         }
    //     });
    // }


}

module.exports = new PaymentsController();
