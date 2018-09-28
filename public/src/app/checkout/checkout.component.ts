import { Component, OnInit } from '@angular/core';
import { CheckoutService } from './checkout.service';
import braintreeClient from 'braintree-web/client';
import braintreeHostedFields from 'braintree-web/hosted-fields';


const paymentDetails = {
  total: {
    label: 'Total',
    amount: {
      currency: 'USD',
      value: '10.00',
    }
  }
};


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit  {
  token = '';

  paymentResponse: any;
  chargeAmount = 30.00;

  constructor(
    private _checkoutService: CheckoutService,
  ) { }

  ngOnInit() {
    braintreeClient.create({
      authorization: 'sandbox_yddk3k3z_7ztv22wfy86bsspy'
    }).then(function (clientInstance) {
      return braintreeHostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'color': '#282c37',
            'font-size': '16px',
            'transition': 'color 0.1s',
            'line-height': '3',
            'border': '.1px solid',
            'padding': '5px'
          },
          // Style the text of an invalid input
          'input.invalid': {
            'color': '#E53A40'
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
      });
    }).then(function (hostedFieldsInstance) {
      let button: HTMLElement = document.getElementById('button-pay');

      button.addEventListener('click', function (event) {
        event.preventDefault();
        console.log("PAYMENT DETAILS", paymentDetails);
        hostedFieldsInstance.tokenize({
          details: paymentDetails
          }).then(function (payload) {
          console.log("PAYLOAD",payload);
          alert('nonce: ' + payload.nonce);
        }).catch(function (err) {
          console.log('tokenization error:', err);
        });
      });
    }).catch(function (err) {
      console.log('****************** creation err! ******************');
      console.log(err);
    });
  }
}