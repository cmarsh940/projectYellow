import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';


@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

    verticalPosition: MatSnackBarVerticalPosition = 'top';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';

    constructor(
        private _authService: AuthService,
        private _router: Router,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.isLoggedIn();
        this.activeSubscription();
        this.isValidated();
    }

    isLoggedIn() {
        let verify = this._authService.verify();
        if (!verify) {
            this.openSnackBar();
            this._router.navigateByUrl('/login');
        } else {
            console.log("YOU ARE VERIFIED");
        }
    }

    activeSubscription() {
        let subscribed = this._authService.subVerified();
        console.log("SUBSCRIBED", subscribed);
        if (!subscribed) {
            this._router.navigateByUrl('/error');
        } else {
            console.log("YOU ARE SUBSCRIPTION IS ACTIVE");
        }
    }

    isValidated() {
        let verified = this._authService.emailVerified();
        if (!verified) {
            this.notValidatedSnackBar();
            this._router.navigateByUrl('/login');
        } else {
            console.log("YOU ARE VALIDATED");
        }

    }

    openSnackBar() {
        const config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = 2500;
        config.panelClass = ['logout-snackbar']
        this.snackBar.open("You are not logged in!", '', config);
    }

    notValidatedSnackBar() {
        const config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = 2500;
        config.panelClass = ['logout-snackbar']
        this.snackBar.open("Please verify your email", '', config);
    }

}