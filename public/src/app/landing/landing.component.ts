import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  BreakpointObserver,
  Breakpoints
} from "@angular/cdk/layout";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}
}
