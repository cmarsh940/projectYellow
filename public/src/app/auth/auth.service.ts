import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from './../global/services/messages.service';
import { Client } from './../global/models/client';
import { Http } from '@angular/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from '../global/services/http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentClient: Client = null;

  private handleError: HandleError;
  private actionUrl = '/api/';
  private ns = 'clients';

  constructor(
    private _messageService: MessagesService,
    private _http: Http,
    private _httpClient: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
  ) {
  this.handleError = httpErrorHandler.createHandleError("AuthService");
    httpOptions;
  }

  authenticate(loginClient: Client, callback) {
    console.log("*** SERVICE LOGIN HIT ***");
    console.log("*** POST ***");
    return this._http.post('/api/clients/login', loginClient).subscribe(
      res => {
        const client = res.json();
        console.log("*** SERVICE CLIENT ***", client);
        if (!client.errors) {
          sessionStorage.setItem('currentClient', JSON.stringify(client._id));
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


  createClient(asset: Client): Observable<any> {
    console.log('Entered AuthService Create');
    console.log('newClient', asset);
    console.log("*** POST ***");
    return this._httpClient.post<any>(this.actionUrl + this.ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('createClient', []))
    );
  }
  // createClient(newClient: Client, callback) {
  //   console.log("*** SERVICE HIT CREAT CLIENT ***", newClient);
  //   console.log("*** POST ***");
  //   return this._http.post('/api/clients', newClient).subscribe(
  //     res => {
  //       const client = res.json();
  //       if (!client.errors) {
  //         console.log("*** SERVICE HIT SET CLIENT***");
  //         this.setCurrentClient(client);
  //       } else {
  //         this.log(client.errors);
  //         this.currentClient = null;
  //         return res.json
  //       }
  //       callback(client);
  //     },
  //     err => console.log(err)
  //   );
  // }

    setCurrentClient(client) {
      console.log("*** SERVICE SET CURRENT CLIENT ***", client)
      sessionStorage.setItem('currentClient', JSON.stringify(client._id));
    }

    logout(callback) {
      console.log("*** SERVICE CLIENT LOGOUT ***");
      console.log("*** DELETE ***");
      return this._http.delete('/api/clients').subscribe(
        res => {
          this.currentClient = null;
          sessionStorage.removeItem('currentClient');
          callback(res.json());
        },
        err => console.error(err)
      );
    }

  verify() {
    let data = sessionStorage.getItem('currentClient');
    if(data) {
      return true;
    }
    return false;
  }
  private extractData(res: Response): any {
    console.log("*** extractData: ***", res);
    return res;
  }

  private log(message: string) {
    this._messageService.add('AuthService: ' + message);
  }
}
