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

  public updateAsset(id: any, itemToUpdate: any): Observable<Survey> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<Survey> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
