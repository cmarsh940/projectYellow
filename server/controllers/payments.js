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
                                    subscribedClient.subscriptionStatus = newSubscriptionResult.subscription.status; 
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
            console.log("UPDATED PAYMENT METHOD", updatePaymentMethod);

            let updatedPaymentToken = updatePaymentMethod.customer.paymentMethods[0].token;
            console.log("PAYMENT TOKEN", updatedPaymentToken);

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
                    console.log(`___ UPDATED SUBSCRIBED CLIENT ___`, subscribedClient);
                    return res.json(subscribedClient);
                });
            });
            return res.json(updatePaymentMethod);
        })
    }


    // CANCEL CLIENTS SUBSCRIPTION
    cancelSubscription(req, res){
        let gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config.merchantId,
            publicKey: config.publicKey,
            privateKey: config.privateKey
        });

        gateway.subscription.cancel("theSubscriptionId", function (err, canceledSubResult) {
            if(err){
                console.log("ERROR CANCELING SUBSCRIPTION", err);
                return res.json(err);
            }
            console.log("CANCELED SUBSCRIPTION", canceledSubResult)
            return res.json(canceledSubResult);
        });
    }

}

module.exports = new PaymentsController();
