import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RightsComponent } from 'app/policies/rights/rights.component';

@Component({
  selector: 'app-subscription-error',
  templateUrl: './subscription-error.component.html',
  styleUrls: ['./subscription-error.component.css']
})
export class SubscriptionErrorComponent {

  constructor(
    // private _authService: AuthService,
    private _router: Router,
    public dialog: MatDialog
    ) { }

  openDialog() {
    const dialogRef = this.dialog.open(RightsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout(): void {
    // this._authService.logout((res) => {
    //   this._router.navigateByUrl('/');
    // });
  }
}
