import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Client } from '@shared/models/client';
import { HandleError, HttpErrorHandler } from '@shared/services/http-error-handler.service';
import { MessagesService } from '@shared/services/messages.service';
import { envUrl } from 'app/envUrl';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentClient: Client = null;

  private handleError: HandleError;
  private actionUrl = 'api/';
  private ns = 'clients';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _messageService: MessagesService,
    private _http: Http,
    private _httpClient: HttpClient,
    private _router: Router,
    private universalStorage: UniversalStorage,
    private httpErrorHandler: HttpErrorHandler,
  ) {
    this.actionUrl = `${envUrl}${this.actionUrl}`;
    this.handleError = this.httpErrorHandler.createHandleError('AuthService');
  }

  authenticate(asset: Client): Observable<any> {
    console.log('*** POST AUTHENTICATE ***');
    return this._httpClient.post<any>(this.actionUrl + this.ns + '/login', asset).pipe(
      map(this.extractData),
      catchError(this.handleError('Authenticate', []))
    );
  }

  addParticipant(asset: any): Observable<any> {
    console.log('Entered AuthService Create');
    console.log('*** POST ***');
    return this._httpClient.post<any>(this.actionUrl + this.ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }

  resetPassword(asset: any): Observable<any> {
    console.log('Entered AuthService Request Password Change');
    const nameService = 'resetPassword';
    return this._httpClient.post<any>(`${this.actionUrl}${this.ns}/${nameService}`, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }
  requestPasswordChange(asset: any): Observable<any> {
    console.log('Entered AuthService Request Password Change');
    const nameService = 'requestReset';
    return this._httpClient.post<any>(`${this.actionUrl}${this.ns}/${nameService}`, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }

  verifyPasswordChange(asset: any): Observable<any> {
    console.log('Entered AuthService Verify Password Change');
    const nameService = 'verifyReset';
    return this._httpClient.post<any>(`${this.actionUrl}${this.ns}/${nameService}`, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('addParticipant', []))
    );
  }

  setCurrentClient(client) {
    console.log('*** SERVICE SET CURRENT CLIENT ***');
    const token = client.token;
    delete client.token;
    const expiresAt = moment().add(client.expiresIn, 'second');
    if (isPlatformBrowser(this.platformId)) {
      this.universalStorage.setItem('token', token);
      this.universalStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
      this.universalStorage.setItem('t940', client._id);
      localStorage.setItem('currentClient', JSON.stringify(client));
    }
  }

  logout(callback) {
    console.log('*** SERVICE CLIENT LOGOUT ***');
    console.log('*** DELETE ***');
    return this._http.delete(this.actionUrl + this.ns).subscribe(
      res => {
        if (isPlatformBrowser(this.platformId)) {
        this.currentClient = null;
        this.universalStorage.removeItem('token');
        this.universalStorage.removeItem('expires_at');
        this.universalStorage.removeItem('t940');
        localStorage.clear();
        callback(res.json());
        }
      },
      err => console.error(err)
    );
  }

  verify() {
    if (isPlatformBrowser(this.platformId)) {
      const data = this.universalStorage.getItem('t940');
      if (data === undefined || data === null || data === '' ) {
        return false;
      } else {
      return true;
      }
    }
  }

  subVerified() {
    if (isPlatformBrowser(this.platformId)) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      const lastDateToUse = moment(new Date).isBefore(data.d);
      console.log('LAST USE DATE', lastDateToUse);
      if ((data.status === 'Active' || data.status === 'Trial')) {
        console.log('ACTIVE OR TRIAL STATUS');
        return true;
      }
      if ((data.status === 'Canceled')) {
        console.log('ACTIVE OR TRIAL STATUS');
        if (lastDateToUse) {
            console.log('STILL IN PAID DATES', lastDateToUse);
            return true;
          } else {
            console.log('NOT IN PAID DATES', lastDateToUse);
            return false;
        }
      } else {
        console.log('ERROR');
        return false;
      }
    }
  }

  emailVerified() {
    if (isPlatformBrowser(this.platformId)) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      if (!data || data.v === null) {
        return false;
      }
      if (data.v) {
        return true;
      } else {
        return false;
      }
    }
  }

  async check(id: any): Promise<any> {
    console.log('*** check ID ***', id);
    const nameService = 'info';
    return await this._httpClient.get<any>(`${this.actionUrl}${this.ns}/${nameService}/${id}`, id).toPromise();
  }

  authorize() {
    if (isPlatformBrowser(this.platformId)) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      if (data) {
        if (data.a8o1 === 'CAPTAIN') {
          return true;
        } else {
          return false;
        }
      } else {
        window.location.href = environment.redirect404;
      }
    }
  }

  checkLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      const data = this.universalStorage.getItem('t940');
      if (!data) {
        return false;
      }
      if (data) {
        return moment().isBefore(this.getExpiration());
      }
      return false;
    }
  }

  getAuthorizationToken() {
      console.log('HIT GET AUTH TOKEN FROM AUTH SERVICE');
      if (this.universalStorage.getItem('token') === null) {
        console.log('NO TOKEN HAS BEEN SET');
        return false;
      } else {
        if (this.universalStorage.getItem('token') === undefined) {
          console.log('AUTHORIZATION FAILED');
          return false;
        } else {
          const data = this.universalStorage.getItem('token');
          return data;
        }
      }
  }

  getExpiration() {
    if (isPlatformBrowser(this.platformId)) {
      const expiration = this.universalStorage.getItem('expires_at');
      const expiresAt = expiration;
      return moment(expiresAt);
    }
  }


  private extractData(res: Response): any {
    if (isPlatformBrowser(this.platformId)) {
      console.log('*** extractData: ***');
      if (!Error) {
        if (!localStorage.getItem('currentClient')) {
          console.log('*** CLIENT NOT IN SESSION ***');
          localStorage.setItem('currentClient', JSON.stringify(res));
          return res;
        } else {
          console.log('*** CLIENT IN SESSION ***');
          return res;
        }
      }
      return res;
    }
    console.log('PLATFORM IS NOT BROWSER');
    return res;
  }

  private log(message: string) {
    this._messageService.add('AuthService: ' + message);
  }
}
