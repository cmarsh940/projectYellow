import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Survey } from './../../global/models/survey';
import { DataService } from '../../global/services/data.service';


@Injectable({
  providedIn: "root"
})
export class SurveyService {
  private NAMESPACE = "surveys";

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
  // public addAsset(itemToAdd: any): Observable<Survey> {
  //   let id = JSON.parse(sessionStorage.getItem('currentClient'));
  //   return this.dataService.custom(this.NAMESPACE, id, itemToAdd);
  // }

  public updateAsset(id: any, itemToUpdate: any): Observable<Survey> {
    console.log("HIT SERVICE UPDATE ASSET");
    console.log("*** ID ***", id);
    console.log("*** ITEM TO UPDATE ***", itemToUpdate);
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }
  public updateAnswer(id: any, itemToUpdate: any): Observable<Survey> {
    console.log("HIT SERVICE UPDATE ANSWER");
    console.log("*** ID ***", id);
    console.log("*** ITEM TO UPDATE ***", itemToUpdate);
    let NAMESPACE = "answers/";
    return this.dataService.update(NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<Survey> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
