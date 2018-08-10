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
  handleError: HandleError;

  private actionUrl = '/api/';

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
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
    return this.http.get<Type[]>(`${this.actionUrl}${ns}`)
      .pipe(
        retry(3),
        catchError(this.handleError('getAll', []))
      );
  }

  public getSingle(ns: string, id: string): Observable<Type> {
    console.log('GetSingle ' + ns);

    return this.http.get<Type>(this.actionUrl + ns + '/' + id + this.resolveSuffix).pipe(
      map(this.extractData),
      catchError(this.handleError('getSingle', []))
    );
  }

  public add(ns: string, asset: Type): Observable<Type> {
    console.log('Entered DataService add');
    console.log('Add ' + ns);
    console.log('asset', asset);

    return this.http.post<Type>(this.actionUrl + ns, asset).pipe(
      tap(this.extractData),
      catchError(this.handleError('getAll', []))
    );
  }

  public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
    console.log('Update ' + ns);
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log('what is the updated item?', JSON.stringify(itemToUpdate));
    return this.http.put<Type>(`${this.actionUrl}${ns}/${id}`, itemToUpdate).pipe(
      tap(this.extractData),
      catchError(this.handleError('getAll', []))
    );
  }

  public delete(ns: string, id: string): Observable<Type> {
    console.log('Delete ' + ns);

    return this.http.delete<Type>(this.actionUrl + ns + '/' + id).pipe(
      tap(_ => this.log(`deleted id=${id}`)),
      catchError(this.handleError<Type>('deleteHero'))
    );
  }

  private extractData(res: Response): any {
    return res;
  }

  /** Log a DataService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DataService: ${message}`);
  }
}
