import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import { ClientService } from "../../services/client.service";
import { Client } from "../../models/client";


@Component({
  selector: "app-client-nav",
  templateUrl: "./client-nav.component.html",
  styleUrls: ["./client-nav.component.css"]
})
export class ClientNavComponent {
  currentUrl: string;
  panelOpenState: boolean = true;
  currentClient: Client = null;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _clientService: ClientService,
    private _router: Router
  ) {
    _router.events.subscribe((_: NavigationEnd) => (this.currentUrl = _.url));
  }

  logout() {
    this._clientService.logout(res => {
      this.currentClient = null;
      this._router.navigateByUrl("/");
    });
  }
}
