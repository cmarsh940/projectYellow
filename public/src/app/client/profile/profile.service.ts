import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Client } from './../../global/models/client';
import { DataService } from './../../global/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private NAMESPACE = 'clients';

  constructor(private dataService: DataService<Client>) { }

  public getparticipant(id: any): Observable<Client> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<Client> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<Client> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<Client> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
