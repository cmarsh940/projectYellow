import { environment } from './../../../environments/environment';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CheckoutService } from './checkout.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { client, hostedFields } from 'braintree-web';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { EditClientComponent } from '../profile/edit-client/edit-client.component';
import { subscription } from '@shared/models/subscription';
import { Client } from '@shared/models/client';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnDestroy, OnInit {
  subscriptionId: number;
  paymentTokenURL = environment.paymentTokenUrl;
  errors = [];
  plans = [];
  selectedPlan: any;
  selected: any;
  amount: any;
  subscriptions = subscription;
  clientId: any;
  planName = '';
  currentClient = new Client();
  loaded: Boolean;
  processing: Boolean;

  private clientToken: string;
  private ngUnsubscribe = new Subject();

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';



  constructor(
    private paymentService: CheckoutService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private _profileService: ProfileService,
    private location: Location,
    public snackBar: MatSnackBar,
    private checkoutRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.processing = false;
    console.log('CHECKOUT DATA', this.data);
    // GET SUBSCRIPTION ID

    // SET CURRENT CLIENT
    const currentClient = this.data.data;
    console.log('CURRENT CLIENT', this.currentClient);

    // SUBSCRIPTION ID
    this.subscriptionId = this.data.subscriptionId;

    // CLIENT ID
    this.clientId = this.data.data._id;


    // GET CLIENT TOKEN
    this.paymentService.getClientToken(this.paymentTokenURL).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: res => {
        this.loaded = false;
        this.clientToken = res.token;
        console.log('Client Token ', this.clientToken);

        this.plans = res.plans.plans;
        console.log('PLANS ', this.plans);
        for (const plan of this.plans) {
          if (this.subscriptionId === plan.id) {
            this.selectedPlan = plan;
          }
        }
        console.log('SELECTED PLAN', this.selectedPlan);
      },
      error: err => {
        console.log('api error' + err);
      },
      complete: () => {
        this.loaded = false;
        this.processing = false;
        this.createPayment();
      }
    });


  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createPayment() {
    this.loaded = true;
    const self = this;
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
    const self = this;
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
      });
  }

  handleHostedFields(hostedFieldsInstance) {
    const self = this;

    document.querySelector('#cardForm').addEventListener('submit',
      function (event) {
        self.processing = false;
        event.preventDefault();
        hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
          self.processing = true;
          if (tokenizeErr) {
            self.processing = false;
            alert('Some payment input fields are invalid.');
            console.error(tokenizeErr);
            return;
          }
          console.log('Got a nonce: ' + payload.nonce);
          const currentClient = self.data.data;
          if (currentClient._subscription === 'FREE') {
            self.processing = true;
            const checkoutURL = environment.checkoutUrl;
            self.paymentService.checkout(checkoutURL, payload.nonce, self.selectedPlan, currentClient).subscribe(res => {
              if (res.success === false) {
                alert('YOUR PAYMENT WAS DECLINED');
                self.processing = false;
                console.error('api error', res);
              } else {
                self.openSnackBar();
                window.location.reload();
              }
            }
            );
          } else {
            self.processing = true;
            const checkoutURL = environment.updatePurchaseUrl;
            self.paymentService.updateSub(checkoutURL, payload.nonce, self.selectedPlan, currentClient).subscribe(res => {
                if (res.success === false) {
                  self.processing =  false;
                  alert('YOUR PAYMENT WAS DECLINED');
                  console.error('api error', res);
                } else {
                  self.openSnackBar();
                  window.location.reload();
                }
              }
            );
          }
        });
      });
  }


  cancel() {
    this.location.back();
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3500;
    config.panelClass = ['success-snackbar'];
    this.snackBar.open('Payment was accepted', '', config);
  }

}
