import { MessagesService } from './../global/services/messages.service';
import { Client } from './../global/models/client';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentClient: Client = null;

  constructor(
    private _messageService: MessagesService,
    private _http: Http
  ) { }

  authenticate(loginClient: Client, callback) {
    console.log("*** SERVICE LOGIN HIT ***");
    console.log("*** POST ***");
    return this._http.post('/api/clients/login', loginClient).subscribe(
      res => {
        const client = res.json();
        console.log("*** SERVICE CLIENT ***", client);
        if (!client.errors) {
          localStorage.setItem('currentClient', JSON.stringify(client));
          console.log("*** SERVICE SET CLIENT ***", client);
        } else {
          console.log("*** SERVICE LOGIN ERROR ***", client.errors);
          this.currentClient = null;
        }
        callback(client);
      },
      err => console.log(err)
    );
  }

  getCurrentClient(): Client {
    return JSON.parse(localStorage.getItem('currentClient'));
  }

  createClient(newClient: Client, callback) {
    console.log("*** SERVICE HIT CREAT CLIENT ***", newClient);
    console.log("*** POST ***");
    return this._http.post('/clients', newClient).subscribe(
      res => {
        const client = res.json();
        console.log("*** SERVICE CLIENT: ***", client);
        if (!client.errors) {
          localStorage.setItem('current_client', JSON.stringify(client));
          console.log("*** SERVICE SET CLIENT ***", client);
        } else {
          console.log("*** SERVICE CREATE CLIENT ERROR ***", client.errors);
          this.currentClient = null;
        }
        callback(client);
      },
      err => console.log(err)
    );
  }

    setCurrentClient(client) {
      console.log("*** SERVICE HIT SET CURRENT CLIENT ***", client)
      sessionStorage.setItem('currentClient', JSON.stringify(client));
    }

    logout(callback) {
      console.log("*** SERVICE CLIENT LOGOUT ***");
      console.log("*** DELETE ***");
      return this._http.delete('/clients').subscribe(
        res => {
          this.currentClient = null;
          callback(res.json());
        },
        err => console.error(err)
      );
    }

  private log(message: string) {
    this._messageService.add('AuthService: ' + message);
  }
}
