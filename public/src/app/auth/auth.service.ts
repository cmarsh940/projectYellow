import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from './../global/services/messages.service';
import { Client } from './../global/models/client';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from '../global/services/http-error-handler.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

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
    private _router: Router,
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
    console.log("*** POST ***");
    return this._httpClient.post<any>(this.actionUrl + this.ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }

  requestPasswordChange(asset: any): Observable<any> {
    console.log('Entered AuthService Request Password Change');
    let nameService = "requestReset";
    return this._httpClient.post<any>(`${this.actionUrl}${this.ns}/${nameService}`, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }
  verifyPasswordChange(asset: any): Observable<any> {
    console.log('Entered AuthService Verify Password Change');
    let nameService = "verifyReset";
    return this._httpClient.post<any>(`${this.actionUrl}${this.ns}/${nameService}`, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }
  
  setCurrentClient(client) {
    console.log("*** SERVICE SET CURRENT CLIENT ***")
    let token = client.token;
    delete client.token;
    const expiresAt = moment().add(client.expiresIn, 'second');

    localStorage.setItem('token', token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('t940', JSON.stringify(client._id));
    sessionStorage.setItem('currentClient', JSON.stringify(client));
  }

  logout(callback) {
    console.log("*** SERVICE CLIENT LOGOUT ***");
    console.log("*** DELETE ***");
    return this._http.delete('/api/clients').subscribe(
      res => {
        this.currentClient = null;
        sessionStorage.removeItem('currentClient');
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at')
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

  subVerified() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    let lastDateToUse = moment(new Date).isBefore(data.d);
    console.log("LAST USE DATE", lastDateToUse);
    if ((data.status === "Active" || data.status === "Trial")) {
      console.log("ACTIVE OR TRIAL STATUS")
      console.log("DATA", data);
      return true
    } 
    else if ((data.status === "Canceled")) {
      console.log("ACTIVE OR TRIAL STATUS")
      console.log("DATA", data);
      if(lastDateToUse){
          console.log("STILL IN PAID DATES", lastDateToUse);
          return true
        } else {
          console.log("NOT IN PAID DATES", lastDateToUse);
          return false
      }
    } else {
      console.log("ERROR");
      return false;
    }
  }

  emailVerified() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    if (!data || data.v === null) {
      return false;
    }
    if (data.v) {
      return true;
    } else {
      return false;
    }
  }

  checkPC() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    if (data.b8o1 === 'FREE') {
      return false;
    } else {
      return true;
    }
  }
  checkCount() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    if (data.c8o1 === 0) {
      return false;
    } else {
      return true;
    }
  }

  authorize() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    if(data) {
      if (data.a8o1 === 'CAPTAIN') {
        return true;
      } else {
        return false
      }
    } else {
      window.location.href = environment.redirect404;
    }
  }

  checkLoggedIn() {
    let data = JSON.parse(sessionStorage.getItem('currentClient'));
    let check = JSON.parse(localStorage.getItem('t940'));
    if(!data) {
      return false;
    }
    if (data._id === check) {
      return moment().isBefore(this.getExpiration());
    } 
    return false;
  }

  getAuthorizationToken() {
    console.log("HIT GET AUTH TOKEN FROM AUTH SERVICE")
    if (localStorage.getItem('token') === null) {
      console.log("NO TOKEN HAS BEEN SET")
      return false;
    }
    else {
      if (localStorage.getItem('token') === undefined) {
        console.log("AUTHORIZATION FAILED");
        return false;
      } else {
        const data = JSON.parse(localStorage.getItem('token')); 
        return data
      }
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  
  private extractData(res: Response): any {
    console.log("*** extractData: ***");
    if (!Error) {
      if (!sessionStorage.getItem('currentClient')) {
        console.log("*** CLIENT NOT IN SESSION ***");
        sessionStorage.setItem('currentClient', JSON.stringify(res));
        return res;
      } else {
        console.log("*** CLIENT IN SESSION ***");
        return res;
      }
    }
    return res;
  }

  private log(message: string) {
    this._messageService.add('AuthService: ' + message);
  }
}
