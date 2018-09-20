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

  authenticate(asset: Client): Observable<any> {
    console.log("*** POST AUTHENTICATE ***");
    return this._httpClient.post<any>(this.actionUrl + this.ns + '/login', asset).pipe(
      map(this.extractData),
      catchError(this.handleError('Authenticate', []))
    );
  }
  
  addParticipant(asset: any): Observable<any> {
    console.log('Entered AuthService Create');
    console.log('newClient', asset);
    console.log("*** POST ***");
    return this._httpClient.post<any>(this.actionUrl + this.ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('createClient', []))
    );
  }

    setCurrentClient(client) {
      console.log("*** SERVICE SET CURRENT CLIENT ***", client)
      sessionStorage.setItem('currentClient', JSON.stringify(client._id));
      localStorage.setItem('t940', JSON.stringify(client._id));
    }

    logout(callback) {
      console.log("*** SERVICE CLIENT LOGOUT ***");
      console.log("*** DELETE ***");
      return this._http.delete('/api/clients').subscribe(
        res => {
          this.currentClient = null;
          sessionStorage.removeItem('currentClient');
          localStorage.removeItem('t940');
          callback(res.json());
        },
        err => console.error(err)
      );
    }

  verify() {
    let data = sessionStorage.getItem('currentClient');
    if (data == undefined || data == null || data == '' ) {
      return false;
    } else {
    return true;
    }
  }
  
  private extractData(res: Response): any {
    console.log("*** extractData: ***", res);
    if (!sessionStorage.getItem('currentClient')) {
      console.log("*** CLIENT NOT IN SESSION ***");
      sessionStorage.setItem('currentClient', JSON.stringify(res));
      return res;
    } else {
      console.log("*** CLIENT IN SESSION ***");
      return res;
    }
  }

  private log(message: string) {
    this._messageService.add('AuthService: ' + message);
  }
}
