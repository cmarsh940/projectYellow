import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material';


@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    verticalPosition: MatSnackBarVerticalPosition = 'top';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';

    constructor(
        private _authService: AuthService,
        private _router: Router,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.Authorized();
        this.isValidated();
    }

    Authorized() {
        let authorized = this._authService.authorize();
        if (!authorized) {
            this.openSnackBar();
            this._router.navigate(['/dashboard']);
        } else {
            console.log("YOU ARE Authorized");
        }
    }

    isValidated() {
        let verified = this._authService.emailVerified();
        if (!verified) {
            this.notValidatedSnackBar();
            this._router.navigate(['/login']);
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
        this.snackBar.open("You are not authorized", '', config);
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