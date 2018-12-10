import { environment } from './../../../environments/environment';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { CheckoutService } from './checkout.service';

import { ActivatedRoute, Router } from '@angular/router';
// import { Location } from "@angular/common";

import { HttpClient } from '@angular/common/http';
import { subscription } from 'src/app/global/models/subscription';
import { ProfileService } from '../profile/profile.service';
import { Client } from 'src/app/global/models/client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { client, hostedFields } from 'braintree-web';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements AfterContentInit, OnDestroy, OnInit{
  subscriptionId: number;
  paymentTokenURL = 'api/braintree/getclienttoken';
  errors = [];
  plans = [];
  selectedPlan: any;
  selected: any;
  amount: any;
  private clientToken: string;
  subscriptions = subscription;
  clientId: any;
  planName = '';
  currentClient = new Client();
  private ngUnsubscribe = new Subject();



  constructor(
    private paymentService: CheckoutService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private _profileService: ProfileService,
    // private location: Location
    ) { }

  ngOnInit() {
    // GET SUBSCRIPTION ID
    this.subscriptionId = this.route.snapshot.params['id'];

    // CLIENT ID
    this.clientId = this.route.snapshot.url[1].path;

    // GET CLIENT TOKEN
    this.paymentService.getClientToken(this.paymentTokenURL).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: res => {
        this.clientToken = res.token;
        console.log("Client Token ", this.clientToken);

        this.plans = res.plans.plans;
        console.log("PLANS ", this.plans);
        for (let plan of this.plans) {
          if (this.subscriptionId === plan.id) {
            this.selectedPlan = plan;
          }
        }
        console.log("SELCTED PLAN", this.selectedPlan);
      },
      error: err => {
        console.log("api error" + err);
      },
      complete: () => {
        this.createPayment();
      }
    });
  }

  ngAfterContentInit(): void {
    this.getClient();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createPayment() {
    var self = this;
    // this.getPlan(this.subscriptionId);
    client.create({
      authorization: environment.braintreeKey
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

          self.paymentService.checkout(checkoutURL, payload.nonce, self.selectedPlan, self.currentClient).subscribe({
            next: res => {
              if (res.success === false) {
                alert("Your payment was declined");
                console.log("api error", res);
              } else {
                console.log("Response", res)
                alert("Thank you for your purchase");
              }
            }
          });
          this._router.navigate(['/dashboard']);
        });
      });
  }


  // cancel() {
  //   this.location.back();
  // }


  getClient() {
    this.errors = [];
    this._profileService.getparticipant(this.clientId).subscribe(
      (res) => {
        this.currentClient = res;
        console.log("CURRENT CLIENT", this.currentClient)
      }
    )
  }
}