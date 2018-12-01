import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutService } from './checkout.service';


import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { client } from 'braintree-web';
import { hostedFields } from 'braintree-web';
import { HttpClient } from '@angular/common/http';
import { subscription } from 'src/app/global/models/subscription';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  subscriptionId: number;
  paymentTokenURL = 'api/braintree/getclienttoken';
  errors = [];
  selected: any;
  amount: any;
  private clientToken: string;
  subscriptions = subscription;
  clientId: any;



  constructor(
    private paymentService: CheckoutService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
    ) { }

  ngOnInit() {
    this.subscriptionId = this.route.snapshot.params['id'];
    console.log("snapshot", this.route.snapshot)
    console.log("SUBSCRIPTION ID", this.subscriptionId);
    this.clientId = this.route.snapshot.url[1].path;
    this.getAmount(this.subscriptionId);
    this.paymentService.getClientToken(this.paymentTokenURL).subscribe({
      next: res => {
        this.clientToken = res;
        console.log("Client Token ",this.clientToken);
      },
      error: err => {
        console.log("api error" + err);
      },
      complete: () => {
        this.createPayment();
      }
    });
  }

  createPayment() {
    var self = this;
    client.create({
      authorization: 'sandbox_yddk3k3z_7ztv22wfy86bsspy'
    },
      function (clientErr, clientInstance) {
        if (clientErr) {
          console.error(clientErr);
          return;
        }
        self.createHostedFields(clientInstance);
      });
  }

  createHostedFields(clientInstance) {
    var self = this;
    hostedFields.create({
      client: clientInstance,
      styles: {
        'input': {
          'color': '#282c37',
          'font-size': '16px',
          'transition': 'color 0.1s',
          'line-height': '3',
          'border': '.1px solid #000000',
          'padding': '5px'
        },
        // Style the text of an invalid input
        'input.invalid': {
          'color': 'red'
        },
        'input.valid': {
          'color': 'green'
        },
        // placeholder styles need to be individually adjusted
        '::-webkit-input-placeholder': {
          'color': 'rgba(0,0,0,0.6)'
        },
        ':-moz-placeholder': {
          'color': 'rgba(0,0,0,0.6)'
        },
        '::-moz-placeholder': {
          'color': 'rgba(0,0,0,0.6)'
        },
        ':-ms-input-placeholder': {
          'color': 'rgba(0,0,0,0.6)'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '•••• •••• •••• ••••'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '•••'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YY'
        }
      }
    },
      function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
          console.error(hostedFieldsErr);
          return;
        }
        self.handleHostedFields(hostedFieldsInstance);
      })
  }

  handleHostedFields(hostedFieldsInstance) {
    var self = this;


    document.querySelector('#cardForm').addEventListener('submit',
      function (event) {
        event.preventDefault();
        const checkoutURL = 'api/braintree/createpurchase';
        hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
          if (tokenizeErr) {
            alert("Some payment input fields are invalid.");
            console.error(tokenizeErr);
            return;
          }
          console.log('Got a nonce: ' + payload.nonce);
          console.log('URL: ' + checkoutURL);
          self.paymentService.checkout(checkoutURL, payload.nonce, self.subscriptionId.toString()).subscribe({
            next: res => {
              console.log("Response", res)
              alert("Thank you for your purchase");

            },
            error: err => {
              alert("Your payment was declined")
              console.log("api error" + err);
            },
          });
        });
      });
  }

  getAmount(id: any): void {
    console.log("GET AMOUNT ID", id);
    if(id == 1) {
      this.amount = 30;
    }
    if (id == 2) {
      this.amount = 35;
    }
    if (id == 3) {
      this.amount = 99;
    }
    if (id == 4) {
      this.amount = 360;
    }
    if (id == 5) {
      this.amount = 420;
    }
    if (id == 6) {
      this.amount = 1188;
    }
    if (id > 6) {
      this.amount = 123456789;
    }
  }

  cancel() {
    this.location.back();
  }
}