import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from 'src/app/global/services/http-error-handler.service';

function getToken() {
  if (sessionStorage.getItem('token') === null) {
    const data = JSON.parse(sessionStorage.getItem('token'));
    return data
  }
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': getToken()
  })
};

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private handleError: HandleError;
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler,) { 
    this.handleError = httpErrorHandler.createHandleError("Checkoutservice");
    httpOptions;
  }

  getClientToken(clientTokenURL: string): Observable<any> {
    return this.http
      .get<any>(clientTokenURL).pipe(
        map(this.extractData),
        catchError(this.handleError('getClientToken', []))
      );
  }

  checkout(checkoutURL: string, nonce: string, selectedPlan: any, currentClient: any): Observable<any> {
    console.log('____ CHECKOUT REACHED _____');
    let params = { 'payment_method_nonce': nonce, 'selectedPlan': selectedPlan, 'currentClient': currentClient };
    return this.http.post<any>(checkoutURL, params).pipe(
      map(this.extractData),
      catchError(this.handleError('checkout', []))
    );
  }

  updateSub(checkoutURL: string, nonce: string, selectedPlan: any, currentClient: any): Observable<any> {
    console.log('____ CHECKOUT REACHED _____');
    let params = { 'payment_method_nonce': nonce, 'selectedPlan': selectedPlan, 'currentClient': currentClient };
    return this.http.put<any>(checkoutURL, params).pipe(
      map(this.extractData),
      catchError(this.handleError('checkout', []))
    );
  }

  private extractData(res: Response): any {
    return res;
  }
}
