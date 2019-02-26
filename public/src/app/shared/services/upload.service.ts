import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { envUrl } from 'app/envUrl';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private actionUrl = 'api/';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
  ) {
    this.actionUrl = `${envUrl}${this.actionUrl}`;
    this.handleError = httpErrorHandler.createHandleError('UploadService');
  }

  postPortfolio(formData, id: string): Observable<any> {
    console.log('**** HIT SERVICE');
    console.log('**** ID', id);

    const URL = this.actionUrl + 'upload/portfolio/' + id;
    console.log('**** url', URL);
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Upload', []))
    );
  }

  addEmailSub(formData): Observable<any> {
    console.log('**** HIT EMAIL SUB SERVICE');

    const URL = this.actionUrl + 'add/emailSub';
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Email Subscription', []))
    );
  }

  postFeedback(formData): Observable<any> {
    console.log('**** HIT UPLOAD SERVICE FOR FEEDBACK');

    const URL = this.actionUrl + 'upload/feedback';
    console.log('**** url', URL);
    return this.http.post<any>(URL, formData).pipe(
      map(this.extractData),
      catchError(this.handleError('Upload', []))
    );
  }

  deleteImage(id: any) {
    const URL = this.actionUrl + 'deleteImage';
    return this.http.delete(URL, id).pipe(
      catchError(this.handleError('DELETE', []))
    );
  }

  private extractData(res: Response): any {
    return res;
  }
}
