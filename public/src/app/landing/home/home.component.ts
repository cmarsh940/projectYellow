import { Component, OnInit } from '@angular/core';
import { utils } from 'protractor';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  step = 0;
  

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  constructor() {}

  ngOnInit() {
    console.log("DEVICE", window.clientInformation.platform);
    console.log("BROWSER", window.clientInformation.vendor);
  }
}
