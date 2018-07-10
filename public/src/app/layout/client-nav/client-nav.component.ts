import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '../../../../node_modules/@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';

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
    private _clientService: ClientService,
    private _router: Router
  ) {}

  logout() {
    this._clientService.logout(res => {
      this.currentClient = null;
      this._router.navigateByUrl("/");
    });
  }
}
