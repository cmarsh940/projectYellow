import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class CredentialsService {
  constructor() {}

  getAuthorizationToken() {
    let token = JSON.parse(localStorage.getItem("current_user._id"));
    return token;
  }
}
