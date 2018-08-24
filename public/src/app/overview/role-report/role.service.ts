import { Injectable } from '@angular/core';
import { DataService } from '../../global/services/data.service';
import { Role } from '../../global/models/role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private NAMESPACE = "roles";

  constructor(private dataService: DataService<Role>) { }

  public getAll(): Observable<Role[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAsset(id: any): Observable<Role> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<Role> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateAsset(id: any, itemToUpdate: any): Observable<Role> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<Role> {
    console.log("ID:", id)
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
