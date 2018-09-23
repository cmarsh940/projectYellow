import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
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

  postPortfolio(formData, id: string) {
    console.log("**** HIT SERVICE");
    console.log("**** FORMDATA", formData);
    console.log("**** ID", id);
    var URL = this.actionUrl + "upload/portfolio/" + id;
    return this.http.post(URL, formData).pipe(
      catchError(this.handleError('POST', []))
    );
  }

  deleteImage(id: any) {
    var URL = this.actionUrl + "deleteImage";
    return this.http.delete(URL, id).pipe(
      catchError(this.handleError('DELETE', []))
    );
  }

  private extractData(res: Response): any {
    console.log("*** extractData: ***", res);
    return res;
  }
}
