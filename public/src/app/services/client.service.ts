import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Http } from "@angular/http";
import { MessagesService } from "./messages.service";
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  currentClient: Client = null;

  constructor(
    private _messageService: MessagesService,
    private _http: Http
  ) { }

  getClients(callback) {
    this._http.get('/clients').subscribe(
      res => callback(res.json()),
      err => console.error(err)
    );
  }

  getCurrentClient(): Client {
    return JSON.parse(localStorage.getItem('currentClient'));
  }

  createClient(newClient: Client, callback) {
    console.log("*** SERVICE HIT CREAT CLIENT ***", newClient);
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
    return this._http.delete('/clients').subscribe(
      res => {
        this.currentClient = null;
        callback(res.json());
      },
      err => console.error(err)
    );
  }

  authenticate(loginClient: Client, callback) {
    console.log("*** SERVICE LOGIN HIT ***");
    return this._http.post('/clients/login', loginClient).subscribe(
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

  destroy(id: string, callback) {
    this._http.delete(`clients/${id}`).subscribe(
      res => callback(res.json()),
      err => console.log(err)
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for client consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ClientService message with the MessageService */
  private log(message: string) {
    this._messageService.add('ClientService: ' + message);
  }
}
