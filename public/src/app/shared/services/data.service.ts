import { AuthService } from './../../auth/auth.service';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { MessagesService } from './messages.service';
import { envUrl } from 'app/envUrl';
import { UniversalStorage } from '@shared/storage/universal.storage';

@Injectable({
  providedIn: 'root'
})
export class DataService<Type> {

  private resolveSuffix = '?resolve=true';
  private actionUrl = 'api/';
  private handleError: HandleError;

  constructor(
    private universalStorage: UniversalStorage,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private messageService: MessagesService,
  ) {
    this.actionUrl = `${envUrl}${this.actionUrl}`;
    this.handleError = httpErrorHandler.createHandleError('Dataservice');
  }

  public getAll(ns: string): Observable<Type[]> {
    console.log('*** GET ***');
    return this.http.get<Type[]>(`${this.actionUrl}${ns}`)
      .pipe(
        retry(3),
        catchError(this.handleError('getAll', []))
      );
  }

  public getClientsUsers(ns: string, id: string): Observable<any> {
    console.log('*** GET CLIENTS USERS ***');
    console.log('*** CLIENTS NAME SPACE ***', ns);
    console.log('*** CLIENTS ID ***', id);
    return this.http.get<any>(this.actionUrl + ns + '/' + id).pipe(
      map(this.extractData),
      catchError(this.handleError('getSingle', []))
    );
  }

  public getSingle(ns: string, id: string): Observable<any> {
    console.log('*** GET ***');
    return this.http.get<any>(this.actionUrl + ns + '/' + id).pipe(
      catchError(this.handleError('getSingle', []))
    );
  }
  public getNotifications(ns: string, id: string): Observable<any> {
    console.log('*** GET ***');
    return this.http.get<any>(this.actionUrl + ns + '/' + id).pipe(
      catchError(this.handleError('getNotifications', []))
    );
  }

  public add(ns: string, asset: any): Observable<any> {
    console.log('Entered DataService add');
    console.log('asset', asset);
    console.log('*** POST ***');

    return this.http.post<any>(this.actionUrl + ns, asset).pipe(
      map(this.extractData),
      catchError(this.handleError('Add', []))
    );
  }

  updateVerification(ns: string, id: string, itemToUpdate: Type): Observable<any> {
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log('*** PUT ***');
    return this.http.put<Type>(`${this.actionUrl}${ns}/verifyemail/${id}`, itemToUpdate)
      .pipe(
        catchError(this.handleError('Update Verification', []))
      );
  }

  public update(ns: string, id: string, itemToUpdate: Type): Observable<any> {
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log('*** PUT ***');
    console.log(`${this.actionUrl}${ns}/${id}`);
    return this.http.put<Type>(`${this.actionUrl}${ns}/${id}`, itemToUpdate)
    .pipe(
      catchError(this.handleError('Update', []))
    );
  }
  public uploadParticipants(ns: string, id: string, itemToUpdate: Type): Observable<any> {
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log('*** PUT ***');
    const nameService = 'usersUpload';
    console.log(`${this.actionUrl}${nameService}/${id}`);
    return this.http.post<Type>(`${this.actionUrl}${nameService}/${id}`, itemToUpdate)
    .pipe(
      catchError(this.handleError('Upload', []))
    );
  }

  public sendSMS(ns: string, id: string, itemToUpdate: Type): Observable<any> {
    console.log('what is the id?', id);
    console.log('what is the updated item?', itemToUpdate);
    console.log('*** POST ***');
    const nameService = 'sendSMS';
    console.log(`${this.actionUrl}${nameService}/${id}`);
    return this.http.post<Type>(`${this.actionUrl}${nameService}/${id}`, itemToUpdate)
    .pipe(
      catchError(this.handleError('Send SMS', []))
    );
  }

  public delete(ns: string, id: string): Observable<any> {
    console.log('what is the id to delete?', id);
    console.log('*** DELETE ***');
    return this.http.delete<any>(this.actionUrl + ns + '/' + id).pipe(
      catchError(this.handleError('Delete', []))
    );
  }

  public cancel(ns: string, id: string): Observable<any> {
    console.log('what is the id to delete?', id);
    console.log('*** DELETE ***');
    return this.http.put<any>(this.actionUrl + ns + '/' + id, id).pipe(
      catchError(this.handleError('Delete', []))
    );
  }

  private extractData(res: Response) {
    const body = res;
    console.log('EXTRACTDATA ->', body);
    return body || {};
  }

  /** Log a DataService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DataService: ${message}`);
  }
}
