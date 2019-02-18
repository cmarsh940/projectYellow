import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { AuthService } from 'app/auth/auth.service';
import { UniversalStorage } from '@shared/storage/universal.storage';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    clientId: any;
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _authService: AuthService,
        private _router: Router,
        private universalStorage: UniversalStorage,
        public snackBar: MatSnackBar
    ) { }

    async ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.clientId = this.universalStorage.getItem('t940');
            if (!this.clientId) {
                await this.notLoggedIn();
            }
            await this.check();
        }
    }

    notLoggedIn() {
        console.log('please login to continue');
        this.openSnackBar();
        this._router.navigateByUrl('/login');
    }

    check() {
        return this._authService.check(this.clientId).then(data => {
            if (!data.v) {
                console.log('EMAIL NOT VERIFIED');
                this.notValidatedSnackBar();
                this._router.navigateByUrl('/login');
            }
            const lastDateToUse = moment(new Date).isBefore(data.d);
            if ((data.status === 'Canceled')) {
                console.log('CANCELED STATUS');
                console.log('DATA', data);
                if (lastDateToUse) {
                    console.log('STILL IN PAID DATES', lastDateToUse);
                } else {
                    console.log('NOT IN PAID DATES', lastDateToUse);
                    this._router.navigateByUrl('/login');
                }
            }
            if ((data.status === 'Active' || data.status === 'Trial')) {
                console.log('ACTIVE OR TRIAL STATUS');
                console.log('DATA', data);
            } else {
                console.log('ERROR');
                this._router.navigateByUrl('/login');
            }
        });
    }

    openSnackBar() {
        const config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = 2500;
        config.panelClass = ['logout-snackbar'];
        this.snackBar.open('You are not logged in!', '', config);
    }

    notValidatedSnackBar() {
        const config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = 2500;
        config.panelClass = ['logout-snackbar'];
        this.snackBar.open('Please verify your email', '', config);
    }
}
