import { DataService } from '../global/services/data.service';
import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";

import { Client } from '../global/models/client';
import { Survey } from '../global/models/survey';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private NAMESPACE = 'clients';

  constructor(
    private dataService: DataService<Client>,
    private dataServiceSurvey: DataService<Survey>
  ) {
  };

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

  public deleteParticipant(id: any): Observable<Client> {
    return this.dataService.delete(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<Survey> {
    let NAMESPACE = "surveys";
    let id = JSON.parse(sessionStorage.getItem('currentClient'));
    return this.dataServiceSurvey.custom(NAMESPACE, id, itemToAdd);
  }
}
