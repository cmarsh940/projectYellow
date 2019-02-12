import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

function getToken() {
  if (localStorage.getItem('token') === null) {
    const data = JSON.parse(localStorage.getItem('token'));
    return data
  }
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'Authorization': getToken()
  })
};

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private actionUrl = '/api/';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
  ) {
    this.actionUrl = `${this.actionUrl}`;
    this.handleError = httpErrorHandler.createHandleError("UploadService");
    httpOptions;
  }

  postPortfolio(formData, id: string): Observable<any> {
    console.log("**** HIT SERVICE");
    console.log("**** ID", id);

    var URL = this.actionUrl + "upload/portfolio/" + id;
    console.log("**** url", URL);
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Upload', []))
    );
  }

  addEmailSub(formData): Observable<any> {
    console.log("**** HIT EMAIL SUB SERVICE");

    var URL = this.actionUrl + "add/emailSub";
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Email Subscription', []))
    );
  }
  
  postFeedback(formData): Observable<any> {
    console.log("**** HIT UPLOAD SERVICE FOR FEEDBACK");

    var URL = this.actionUrl + "upload/feedback";
    console.log("**** url", URL);
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Upload', []))
    );
  }

  deleteImage(id: any) {
    var URL = this.actionUrl + "deleteImage";
    return this.http.delete(URL, id).pipe(
      catchError(this.handleError('DELETE', []))
    );
  }

  private extractData(res: Response): any {
    return res;
  }
}
