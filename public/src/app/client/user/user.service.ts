import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';
import { User } from '@shared/models/user';




@Injectable({
  providedIn: 'root'
})

export class UserService {
  private NAMESPACE = 'users';

  constructor(
    private dataService: DataService<User>
  ) {
  }

  public getAll(): Observable<User[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getClientsUsers(id: any): Observable<any> {
    console.log('HIT SERVICE GET CLIENTS USERS');
    console.log('*** ID ***', id);
    return this.dataService.getClientsUsers(this.NAMESPACE, id);
  }

  public getparticipant(id: any): Observable<User> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<User> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }


  public updateParticipant(id: any, itemToUpdate: any): Observable<User> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public uploadParticipants(id: any, itemToUpdate: any): Observable<User> {
    return this.dataService.uploadParticipants(this.NAMESPACE, id, itemToUpdate);
  }
  public sendSMS(id: any, itemToUpdate: any): Observable<User> {
    return this.dataService.sendSMS(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<User> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
