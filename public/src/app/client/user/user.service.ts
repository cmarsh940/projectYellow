import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../global/services/data.service';
import { User } from './../../global/models/user';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private NAMESPACE = 'users';

  constructor(
    private dataService: DataService<User>
  ) {
  };

  public getAll(): Observable<User[]> {
    return this.dataService.getAll(this.NAMESPACE);
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

  public deleteParticipant(id: any): Observable<User> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
