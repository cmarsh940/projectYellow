const mongoose = require('mongoose');
const braintree = require('braintree');
const Client = mongoose.model('Client');
const config = require("../config/config");
const token = String
const tempSub = require("../models/staticModels/subscription");
class PaymentsController {

    // GET TOKEN FOR CLIENT
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
            })
            
        })
    }



    // CHECKOUT
    checkout(req, res) {
        console.log("___ HIT SERVER CHECKOUT ___");
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
        
        // SUBSCRIPTION PRICE
        let paymentAmount = plan.price;

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
                    console.log("CREATED NEW CUSTOMER");

                    // CREATED PAYMENT TOKEN FROM RETURNED PARAMETERS
                    let paymentToken = newCustomerResult.customer.paymentMethods[0].token;

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
                                console.log("CREATED NEW SUBSCRIPTION");
                                let subObject = {};
                                for(let sub of tempSub) {
                                    if(sub.id === plan.id) {
                                        subObject = sub
                                    }
                                }

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
                                    subscribedClient.paidThroughDate = newSubscriptionResult.subscription.paidThroughDate; 
                                    subscribedClient.subscriptionStatus = newSubscriptionResult.subscription.status; 
                                    subscribedClient.save((err, subscribedClient) => {
                                        if (err) {
                                            console.log(`___ SAVE SUBSCRIBED CLIENT ERROR ___`, err);
                                            return res.json(err);
                                        }
                                        console.log(`___ UPDATED SUBSCRIBED CLIENT ___`);
                                        return res.json(subscribedClient);
                                    }); 
                                });
                            } else {
                                console.log("ERROR CREATING NEW SUBSCRIPTION");
                                return res.json(newSubscriptionResult);
                            }
                        }
                    });

                } else {
                    console.log("ERROR CREATING NEW CUSTOMER");
                    return res.json(newCustomerResult);
                } 
            }
        })
    }
    // CHECKOUT
    update(req, res) {
        console.log("___ HIT SERVER CHECKOUT ___");
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
        
        // SUBSCRIPTION PRICE
        let paymentAmount = plan.price;

        // CREATE NEW CUSTOMER
        console.log("___ BODY ___",req.body);
        gateway.subscription.cancel(req.body.currentClient.subscriptionId, function (err, canceledSubResult) {
            if (err) {
                console.log("ERROR CANCELING SUBSCRIPTION", err);
                return res.json(err);
            } else {
                if (canceledSubResult.success) {
                    console.log("UPDATE CUSTOMER");

                    let paymentToken = req.body.currentClient.paymentToken
                    // CREATE SUBSCRIPTION
                    gateway.subscription.create({
                        paymentMethodToken: paymentToken,
                        planId: plan.id
                    }, function (err, newSubscriptionResult) {
                        if (err) {
                            console.log("ERROR CREATING NEW SUBSCRIPTION", err);
                            return res.json(err);
                        } else {
                            if (newSubscriptionResult.success) {
                                console.log("CREATED NEW SUBSCRIPTION");
                                let subObject = {};
                                for (let sub of tempSub) {
                                    if (sub.id === plan.id) {
                                        subObject = sub
                                    }
                                }

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
                                    subscribedClient.paidThroughDate = newSubscriptionResult.subscription.paidThroughDate;
                                    subscribedClient.subscriptionStatus = newSubscriptionResult.subscription.status;
                                    subscribedClient.save((err, subscribedClient) => {
                                        if (err) {
                                            console.log(`___ SAVE SUBSCRIBED CLIENT ERROR ___`, err);
                                            return res.json(err);
                                        }
                                        console.log(`___ UPDATED SUBSCRIBED CLIENT ___`);
                                        return res.json(subscribedClient);
                                    });
                                });
                            } else {
                                console.log("ERROR CREATING NEW SUBSCRIPTION");
                                return res.json(newSubscriptionResult);
                            }
                        }
                    })

                } else {
                    console.log("ERROR CANCELING", canceledSubResult);
                    return res.json(canceledSubResult);
                } 
            }
        })
    }


    // UPDATE PAYMENT METHOD
    updatePaymentMethod(req, res){
        let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        // Use the payment method nonce here
        let nonceFromTheClient = req.body.payment_method_nonce;
        
        gateway.paymentMethod.update("thePaymentMethodToken", {
            paymentMethodNonce: nonceFromTheClient,
            options: {
                verifyCard: true
            }
        }, function (err, updatePaymentMethod) {
            if (err) {
                console.log("ERROR UPDATING PAYMENT METHOD", err);
                return res.json(err);
            }
            console.log("UPDATED PAYMENT METHOD");

            let updatedPaymentToken = updatePaymentMethod.customer.paymentMethods[0].token;
            console.log("PAYMENT TOKEN");

            // FIND AND UPDATE CLIENT THAT UPDATED PAYMENT METHOD
            Client.findById(req.body.currentClient._id, (err, updatedClient) => {
                if (err) {
                    console.log("ERROR FINDING CLIENT TO UPDATE", err)
                    return res.json(err);
                }

                updatedClient.paymentToken = updatedPaymentToken;
                updatedClient.save((err, subscribedClient) => {
                    if (err) {
                        console.log(`___ SAVE SUBSCRIBED CLIENT ERROR ___`, err);
                        return res.json(err);
                    }
                    console.log(`___ UPDATED SUBSCRIBED CLIENT ___`);
                    return res.json(subscribedClient);
                });
            });
            return res.json(updatePaymentMethod);
        })
    }


    // CANCEL CLIENTS SUBSCRIPTION
    cancelSubscription(req, res){
        console.log("___ SERVER HIT CANCEL SUBSCRIPTION ___");
        let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        gateway.subscription.cancel(req.params.id, function (err, canceledSubResult) {
            if(err){
                console.log("ERROR CANCELING SUBSCRIPTION", err);
                return res.json(err);
            }

            console.log("UNSUBSCRIBED ID", canceledSubResult.subscription.id);
            Client.findOne({ subscriptionId: canceledSubResult.subscription.id }, (err, updatedClient) => {
                if (err) {
                    console.log("ERROR FINDING CLIENT TO UPDATE", err)
                    return res.json(err);
                }
                updatedClient.subscriptionStatus = canceledSubResult.subscription.status;
                updatedClient._subscription = canceledSubResult.subscription.status;
                updatedClient.lastUseDate = canceledSubResult.subscription.paidThroughDate;
                updatedClient.save((err, unsubscribedClient) => {
                    if (err) {
                        console.log(`___ SAVE CANCELED SUBSCRIPTION CLIENT ERROR ___`, err);
                        return res.json(err);
                    }
                    console.log(`___ UPDATED UNSUBSCRIBED CLIENT ___`);
                    return res.json(unsubscribedClient);
                });
            });
        });
    }

}

module.exports = new PaymentsController();
