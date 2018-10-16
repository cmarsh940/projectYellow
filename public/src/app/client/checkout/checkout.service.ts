import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from 'src/app/global/services/http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
 })
};

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private resolveSuffix = "?resolve=true";
  private actionUrl = '/api/';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
  ) {this.handleError = httpErrorHandler.createHandleError("Checkoutservice");
    httpOptions;}

  getClientTokenFunction(): Observable<any> {
    console.log("*** GET ***");
    return this.http.get<any>(this.actionUrl + 'braintree/getclienttoken').pipe(
      map(this.extractData),
      catchError(this.handleError('getClientToken', []))
    );
  }

  private extractData(res: Response): any {
    console.log("*** extractData: ***");
    return res;
  }
}
