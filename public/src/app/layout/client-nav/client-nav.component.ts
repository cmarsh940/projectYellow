import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Client } from './../../global/models/client';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: "client-nav",
  templateUrl: "./client-nav.component.html",
  styleUrls: ["./client-nav.component.css"]
})
export class ClientNavComponent {
  currentClient: Client = null;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
    private _router: Router
  ) {}

  logout(): void {
    this._authService.logout((res) => {
      this.currentClient = null;
      this._router.navigateByUrl('/');
    });
  }
}
