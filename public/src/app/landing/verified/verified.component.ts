import { ClientService } from './../../client/client.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.css']
})
export class VerifiedComponent implements OnInit {
  clientId: string;
  clientToken: string;
  errors = [];
  loaded: boolean;

  constructor(
    private _clientService: ClientService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loaded = false;
    console.log("SNAPSHOT", this.route.snapshot);
    this.clientId = this.route.snapshot.url[1].path;
    this.clientToken = this.route.snapshot.params['id'];
    this.verifyClientEmail();
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }

  verifyClientEmail() {
    this._clientService.updateVerification(this.clientId, this.clientToken)
    .subscribe((data: any) => {
      if (data.errors) {
        console.log("*** ERROR ***", data.errors)
        for (const key of Object.keys(data.errors)) {
          const error = data.errors[key];
          this.errors.push(error.message);
        }
      } else {
        console.log("SUCCESS");
      }
    })
  }
}
