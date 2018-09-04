import { Injectable, Optional, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { MessagesService } from './messages.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class DataService<Type> {

  private resolveSuffix = "?resolve=true";
  private actionUrl = '/api/';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private messageService: MessagesService,
  ) {
    this.actionUrl = `${this.actionUrl}`;
    this.handleError = httpErrorHandler.createHandleError("Dataservice");
    httpOptions;
  }

  public getAll(ns: string): Observable<Type[]> {
    console.log('GetAll ' + ns + ' from ' + this.actionUrl + ns);
    console.log("*** GET ***");
    return this.http.get<Type[]>(`${this.actionUrl}${ns}`)
      .pipe(
        retry(3),
        catchError(this.handleError('getAll', []))
      );
  }

  public getSingle(ns: string, id: string): Observable<Type> {
    console.log('GetSingle ' + ns);
    console.log("*** GET ***");
    return this.http.get<Type>(this.actionUrl + ns + '/' + id + this.resolveSuffix).pipe(
      map(this.extractData),
      catchError(this.handleError('getSingle', []))
    );
  }

  public add(ns: string, asset: Type): Observable<Type> {
    console.log('Entered DataService add');
    console.log('Add ' + ns);
    console.log('asset', asset);
    console.log("*** POST ***");
    return this.http.post<Type>(this.actionUrl + ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('Add', []))
    );
  }

  public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
    console.log('Update ' + ns);
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log("*** PUT ***");
    console.log(`${this.actionUrl}${ns}/${id}`)
    return this.http.patch<Type>(this.actionUrl + ns + id, itemToUpdate, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError('Update', []))
    );
  }

  public delete(ns: string, id: string): Observable<any> {
    console.log('Delete ' + ns);
    console.log('what is the id to delete?', id);
    console.log("*** DELETE ***");
    return this.http.delete<any>(this.actionUrl + ns + '/' + id).pipe(
      catchError(this.handleError('Delete', []))
    );
  }

  private extractData(res: Response): any {
    console.log("*** extractData: ***", res);
    return res;
  }

  /** Log a DataService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DataService: ${message}`);
  }
}
