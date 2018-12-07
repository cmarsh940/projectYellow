const mongoose = require('mongoose');
const braintree = require('braintree');
const Client = mongoose.model('Client');
const config = require("../config/config");
const token = String


const tempSub = [
        {
            "id": "0",
            "name": "FREE",
            "price": 0.00,
            "surveyCount": 5,
            "billingCycle": 1
        },
        {
            "id": "1",
            "name": "BASIC",
            "price": 30.00,
            "surveyCount": 100,
            "billingCycle": 1
        },
        {
            "id": "2",
            "name": "PRO",
            "price": 35.00,
            "surveyCount": 99999,
            "billingCycle": 1
        },
        {
            "id": "3",
            "name": "ELITE",
            "price": 99.00,
            "surveyCount": 99999,
            "billingCycle": 1
        },
        {
            "id": "4",
            "name": "BASIC",
            "price": 360.00,
            "surveyCount": 99999,
            "billingCycle": 12
        },
        {
            "id": "5",
            "name": "PRO",
            "price": 420.00,
            "surveyCount": 99999,
            "billingCycle": 12
        },
        {
            "id": "6",
            "name": "ELITE",
            "price": 1188.00,
            "surveyCount": 99999,
            "billingCycle": 12
        }
]
class PaymentsController {

    getClientToken(req, res) {
        console.log("___ SERVER GET CLIENT TOKEN HIT ___");
        let gateway = braintree.connect({
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
        // Create gateway to braintree
        let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        // PAYMENT METHOD NONCE
        let nonceFromTheClient = req.body.payment_method_nonce;
        console.log("SERVER NONCE FROM CLIENT", nonceFromTheClient);

        // SUBSCRIPTION PLAN
        let plan = req.body.selectedPlan;
        console.log("SERVER SUBSCRIPTION PLAN", plan);
        
        // SUBSCRIPTION PRICE
        let paymentAmount = plan.price;
        console.log("SERVER PAYMENT AMOUNT", paymentAmount);

        // CREATE NEW CUSTOMER
        gateway.customer.create({
            paymentMethodNonce: nonceFromTheClient,
            id: req.body.currentClient._id,
            firstName: req.body.currentClient.firstName,
            lastName: req.body.currentClient.lastName,
            company: req.body.currentClient.businessName,
            email: req.body.currentClient.email,
            phone: req.body.currentClient.phone,
        }, function (err, newCustomerResult) {
            if(err) {
                console.log("ERROR CREATING NEW CUSTOMER", err);
                return res.json(err);
            } else {
                if (newCustomerResult.success) {
                    console.log("CREATED NEW CUSTOMER", newCustomerResult);

                    let paymentToken = newCustomerResult.customer.paymentMethods[0].token;
                    console.log("PAYMENT TOKEN", paymentToken);

                    // CREATE SUBSCRIPTION
                    gateway.subscription.create({
                        paymentMethodToken: paymentToken,
                        planId: plan.id
                    }, function (err, newSubscriptionResult) {
                        if (err) {
                            console.log("ERROR CREATING NEW SUBSCRIPTION", err);
                            return res.json(err);
                        } else {
                            if(newSubscriptionResult.success) {
                                console.log("CREATED NEW SUBSCRIPTION", newSubscriptionResult);
                                let subObject = {};
                                console.log("TEMP SUB", tempSub);
                                for(let sub of tempSub) {
                                    if(sub.id === plan.id) {
                                        subObject = sub
                                        console.log("SUB", sub);
                                    }
                                }
                                console.log("SUB OBJECT", subObject);
                                // FIND AND UPDATE CLIENT THAT JUST SUBSCRIBED
                                Client.findById(req.body.currentClient._id, (err, subscribedClient) => {
                                    if (err) {
                                        console.log("ERROR FINDING CLIENT TO UPDATE", err)
                                        return res.json(err);
                                    }
                                    subscribedClient._subscription = subObject.name;
                                    subscribedClient.surveyCount = subObject.surveyCount; 
                                    subscribedClient.subscriptionId = newSubscriptionResult.subscription.id; 
                                    subscribedClient.paymentToken = paymentToken; 
                                    subscribedClient.save((err, subscribedClient) => {
                                        if (err) {
                                            console.log(`___ SAVE SUBSCRIBED CLIENT ERROR ___`, err);
                                            return res.json(err);
                                        }
                                        console.log(`___ UPDATED SUBSCRIBED CLIENT ___`, subscribedClient);
                                        return res.json(subscribedClient);
                                    }); 
                                });
                            } else {
                                console.log("ERROR CREATING NEW SUBSCRIPTION", newSubscriptionResult);
                                return res.json(newSubscriptionResult);
                            }
                        }
                    });

                } else {
                    console.log("ERROR CREATING NEW CUSTOMER", newCustomerResult);
                    return res.json(newCustomerResult);
                } 
            }
        });
    }
    // checkout(req, res) {
    //     console.log("___ HIT SERVER CHECKOUT ___");
    //     console.log("___ req ___", req.body);
    //     // Create gateway to braintree
    //     let gateway = braintree.connect({
    //         environment: braintree.Environment.Sandbox,
    //         merchantId: config.merchantId,
    //         publicKey: config.publicKey,
    //         privateKey: config.privateKey
    //     });

    //     // PAYMENT METHOD NONCE
    //     let nonceFromTheClient = req.body.payment_method_nonce;
    //     console.log("SERVER NONCE FROM CLIENT", nonceFromTheClient);

    //     // SUBSCRIPTION PLAN
    //     let plan = req.body.selectedPlan;
    //     console.log("SERVER SUBSCRIPTION PLAN", plan);
        
    //     // SUBSCRIPTION PRICE
    //     let paymentAmount = plan.price;
    //     console.log("SERVER PAYMENT AMOUNT", paymentAmount);

    //     // SUBMIT TRANSACTION FOR VERIFICATION THROUGH BRAINTREE
    //     newTransaction = gateway.transaction.sale({
    //         amount: paymentAmount,
    //         paymentMethodNonce: nonceFromTheClient,
    //         taxAmount: "5.00",
    //         customer: {
    //             id: req.body.currentClient._id,
    //             firstName: req.body.currentClient.firstName,
    //             lastName: req.body.currentClient.lastName,
    //             company: req.body.currentClient.businessName,
    //             email: req.body.currentClient.email,
    //             phone: req.body.currentClient.phone,
    //         },
    //         options: {
    //             submitForSettlement: true,
    //             storeInVaultOnSuccess: true
    //         },
    //         deviceData: req.body.device_data
    //     }, function (err, result) {
    //         if (err) {
    //             console.log("PAYMENT ERROR", err);
    //             return res.json(err);
    //         } else {
    //             console.log("PAYMENT", result);
    //             if (result.success || result.transaction) {
    //                 console.log("AFTER PAYMENT SUCCESS CREATING SUBSCRIPTION");
    //                 console.log("PAYMENT TOKEN", paymentToken);
    //                 gateway.subscription.create({
    //                     paymentMethodToken: paymentToken,
    //                     planId: plan.id,
    //                     merchantAccountId: "marshallevansllc",
    //                 }, function (err, subscriptionResult) {
    //                     if (err) {
    //                         console.log("SERVER SUBSCRIPTION ERROR");
    //                         return res.json(err);
    //                     } else {
    //                         console.log("SERVER SUBSCRIPTION COMPLETE");
    //                         return res.json(subscriptionResult);
    //                     }
    //                 });
    //             } else {
    //                 transactionErrors = result.errors.deepErrors();
    //                 console.log("AFTER PAYMENT FAILED", transactionErrors);
    //                 return res.json(transactionErrors);
    //             }
    //         }
    //     });
    // }

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
            amount: "0.00",
            paymentMethodNonce: nonceFromTheClient,
            customerId: req.body.currentClient._id,
            options: {
                storeInVaultOnSuccess: true
            }
        }, function (err, result) {
        });
    }

}

module.exports = new PaymentsController();
