import { Client } from './../../global/models/client';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: Client;

  constructor() { }

  ngOnInit() {
  }

}
