import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';
import { Survey } from '@shared/models/survey';



@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private NAMESPACE = 'surveys';

  constructor(private dataService: DataService<Survey>) { }

  public getAll(): Observable<Survey[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAsset(id: any): Observable<Survey> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<Survey> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateAsset(id: any, itemToUpdate: any): Observable<Survey> {
    console.log('HIT SERVICE UPDATE ASSET');
    console.log('*** ID ***', id);
    console.log('*** ITEM TO UPDATE ***', itemToUpdate);
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }
  public updateAnswer(id: any, itemToUpdate: any): Observable<Survey> {
    console.log('HIT SERVICE UPDATE ANSWER');
    console.log('*** ID ***', id);
    console.log('*** ITEM TO UPDATE ***', itemToUpdate);
    const NAMESPACE = 'answer/surveys';
    return this.dataService.update(NAMESPACE, id, itemToUpdate);
  }
  public updatePrivateAnswer(id: any, itemToUpdate: any): Observable<Survey> {
    console.log('HIT SERVICE UPDATE ANSWER');
    console.log('*** ID ***', id);
    console.log('*** ITEM TO UPDATE ***', itemToUpdate);
    const NAMESPACE = 'answer/pSurveys';
    return this.dataService.update(NAMESPACE, id, itemToUpdate);
  }

  public closeAsset(id: any): Observable<Survey> {
    const NAMESPACE = 'close/surveys';
    return this.dataService.cancel(NAMESPACE, id);
  }

  public openAsset(id: any): Observable<Survey> {
    const NAMESPACE = 'open/surveys';
    return this.dataService.cancel(NAMESPACE, id);
  }

  public deleteAsset(id: any): Observable<Survey> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
