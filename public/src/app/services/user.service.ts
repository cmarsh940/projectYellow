import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http } from '@angular/http';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = null;

  constructor(
    private _messageService: MessagesService,
    private _http: Http
  ) { }

  getUsers(callback) {
    this._http.get('/users').subscribe(
      res => callback(res.json()),
      err => console.error(err)
    );
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  createUser(newUser: User, callback) {
    return this._http.post('/users', newUser).subscribe(
      res => {
        const user = res.json();
        if (!user.errors) {
          localStorage.setItem('current_user', JSON.stringify(user));
        } else {
          this.currentUser = null;
        }
        callback(user);
      },
      err => console.log(err)
    );
  }

  setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(callback) {
    return this._http.delete('/users').subscribe(
      res => {
        this.currentUser = null;
        callback(res.json());
      },
      err => console.error(err)
    );
  }

  authenticate(loginUser: User, callback) {
    return this._http.post('/users/login', loginUser).subscribe(
      res => {
        const user = res.json();
        if (!user.errors) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          this.currentUser = null;
        }
        callback(user);
      },
      err => console.log(err)
    );
  }

  destroy(id: string, callback) {
    this._http.delete(`users/${id}`).subscribe(
      res => callback(res.json()),
      err => console.log(err)
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this._messageService.add('UserService: ' + message);
  }
}
