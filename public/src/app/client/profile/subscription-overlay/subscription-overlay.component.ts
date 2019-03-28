import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatDialog } from '@angular/material';
import { CheckoutComponent } from '../../checkout/checkout.component';

@Component({
  selector: 'app-subscription-overlay',
  templateUrl: './subscription-overlay.component.html',
  styleUrls: ['./subscription-overlay.component.css']
})
export class SubscriptionOverlayComponent implements OnInit {

  constructor(
    public checkoutDialog: MatDialog,
    private bottomSheetRef: MatBottomSheetRef<SubscriptionOverlayComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log('data is', this.data);
  }

  openLink(event: MouseEvent, subscriptionId: any): void {
    console.log('DATA IS', this.data);
    this.bottomSheetRef.dismiss();
    event.preventDefault();
    console.log(subscriptionId);
    this.openCheckout(subscriptionId);
  }

  openCheckout(subscriptionId: any) {
    console.log('NEW DATA TRANSFER', this.data);
    const checkoutRef = this.checkoutDialog.open(CheckoutComponent, {
      data: {
        data: this.data,
        subscriptionId: subscriptionId
      }
    });

    checkoutRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }
}
