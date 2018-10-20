import { DataService } from '../global/services/data.service';
import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";

import { Client } from '../global/models/client';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private NAMESPACE = 'clients';

  constructor(
    private dataService: DataService<Client>,
    ) {};

  public getAll(): Observable<Client[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getparticipant(id: any): Observable<Client> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<Client> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<Client> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }
  public updateVerification(id: any, itemToUpdate: any): Observable<Client> {
    return this.dataService.updateVerification(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<Client> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
