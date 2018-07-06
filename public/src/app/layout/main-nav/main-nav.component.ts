import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
import {
  BreakpointObserver,
  Breakpoints
} from "@angular/cdk/layout";

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  currentUrl: string;
  panelOpenState: boolean = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url)
  }

}
