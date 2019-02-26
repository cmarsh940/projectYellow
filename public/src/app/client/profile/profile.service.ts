import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { Client } from '@shared/models/client';


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

  public disableParticipant(id: any): Observable<Client> {
    const NAMESPACE = 'disableC';
    return this.dataService.cancel(NAMESPACE, id);
  }

  public deleteParticipant(id: any): Observable<Client> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
  public cancelSubscription(id: any): Observable<Client> {
    const ns = 'payment/cancel';
    return this.dataService.cancel(ns, id);
  }
}
