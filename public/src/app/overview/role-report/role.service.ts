import { Injectable } from '@angular/core';
import { DataService } from '../../global/services/data.service';
import { Role } from '../../global/models/role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private NAMESPACE = 'roles';

  constructor(
    private dataService: DataService<Role>
  ) {};

  public getAll(): Observable<Role[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public get(id: any): Observable<Role> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public add(itemToAdd: any): Observable<Role> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public update(id: any, itemToUpdate: any): Observable<Role> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public delete(id: any): Observable<Role> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}
