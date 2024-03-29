import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';
import { SurveyCategory } from '@shared/models/survey-category';

@Injectable({
  providedIn: 'root'
})
export class SurveyCategoryService {

  private NAMESPACE = 'survey-categories';

  constructor(private dataService: DataService<SurveyCategory>) { }

  public getAll(): Observable<SurveyCategory[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAsset(id: any): Observable<SurveyCategory> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<SurveyCategory> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateAsset(id: any, itemToUpdate: any): Observable<SurveyCategory> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<SurveyCategory> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
