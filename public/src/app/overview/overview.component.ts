import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    constructor(
        private _authService: AuthService,
        private _router: Router,
    ) { }

    ngOnInit() {
        // this.Authorized();
        // this.isValidated();
    }

    Authorized() {
        let authorized = this._authService.authorize();
        if (!authorized) {
            this._router.navigate(['/404error']);
        } else {
            console.log('YOU ARE Authorized');
        }
    }

    isValidated() {
        let verified = this._authService.emailVerified();
        if (!verified) {
            this._router.navigate(['/404error']);
        } else {
            console.log('YOU ARE VALIDATED');
        }
    }

}
