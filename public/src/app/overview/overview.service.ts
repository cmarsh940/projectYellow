import { Injectable } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  constructor(
    private dataService: DataService<any>,
  ) { }

  public getAllUsers(): Observable<any[]> {
    let NAMESPACE = 'reports/users';
    return this.dataService.getAll(NAMESPACE);
  }
  public getAllCategories(): Observable<any[]> {
    let NAMESPACE = 'reports/survey-categories';
    return this.dataService.getAll(NAMESPACE);
  }
  public getAllClients(): Observable<any[]> {
    let NAMESPACE = 'reports/clients';
    return this.dataService.getAll(NAMESPACE);
  }
  public getAllfeedbacks(): Observable<any[]> {
    let NAMESPACE = 'reports/feedbacks';
    return this.dataService.getAll(NAMESPACE);
  }
  public getAllSurveys(): Observable<any[]> {
    let NAMESPACE = 'reports/surveys';
    return this.dataService.getAll(NAMESPACE);
  }

  public getparticipant(id: any): Observable<any> {
    let NAMESPACE = 'reports/users';
    return this.dataService.getSingle(NAMESPACE, id);
  }
  public getInfo(id: any): Observable<any> {
    const NAMESPACE = 'clients/info';
    return this.dataService.getSingle(NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<any> {
    let NAMESPACE = 'reports/users';
    return this.dataService.add(NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<any> {
    let NAMESPACE = 'users';
    return this.dataService.update(NAMESPACE, id, itemToUpdate);
  }

  public updateVerification(id: any, itemToUpdate: any): Observable<any> {
    let NAMESPACE = 'users';
    return this.dataService.updateVerification(NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<any> {
    let NAMESPACE = 'reports/users';
    return this.dataService.delete(NAMESPACE, id);
  }
}
