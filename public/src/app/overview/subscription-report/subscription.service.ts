import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';
import { Subscription } from '@shared/models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private NAMESPACE = 'subsrciptions';

  constructor(
    private dataService: DataService<Subscription>
  ) {}

  public getAll(): Observable<Subscription[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public get(id: any): Observable<Subscription> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public add(itemToAdd: any): Observable<Subscription> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public update(id: any, itemToUpdate: any): Observable<Subscription> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public delete(id: any): Observable<Subscription> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
