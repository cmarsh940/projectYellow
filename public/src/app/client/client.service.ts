import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';
import { Client } from '@shared/models/client';



@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private NAMESPACE = 'clients';

  constructor(
    private dataService: DataService<Client>,
    ) {}

  public getAll(): Observable<Client[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getparticipant(id: any): Observable<Client> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }
  public getInfo(id: any): Observable<Client> {
    const NAMESPACE = 'clients/info';
    return this.dataService.getSingle(NAMESPACE, id);
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
  public getNotifications(id: any): Observable<any> {
    const NAMESPACE = 'clients/notifications';
    return this.dataService.getNotifications(NAMESPACE, id);
  }
}
