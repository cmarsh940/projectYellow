const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const config = require("../config/config");
const stripe = require('stripe')(config.stripe_secret_key);


class PaymentsController {
    async create(req, res) {
        var customer = await stripe.customers.create(
            { email: req.body.email }
        ).then(function (customer) {
            console.log("CUSTOMER", customer);
            return stripe.customers.createSource(customer.id, {
                source: 'tok_visa'
            });
        }).then(function (source) {
            console.log("SOURCE", source);
            return stripe.charges.create({
                amount: 50,
                currency: 'usd',
                customer: source.customer
            });
        }).then(function (charge) {
            console.log("CHARGE", charge);
            // New charge created on a new customer

        }).catch(function (err) {
            console.log("ERROR STRIPE", err);
            // Deal with an error
        });;
    }

    show(req, res){
        stripe.subscriptions.list(
            { limit: 3 },
            function (err, subscriptions) {
                // asynchronously called
                if(err) {
                    console.log("ERROR", err);
                } else {
                    console.log("subscriptions", subscriptions);
                }
            });
    }


}

module.exports = new PaymentsController();
