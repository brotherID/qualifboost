import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'http://localhost:3333/api/v1/settings/role';

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }


  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  addRole(role: Role): Observable<any> {
    return this.http.post(`${this.apiUrl}`, role);
  }


  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateRole(role: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}`, role);
  }

  deletePermissionFromRole(roleId: string, permission: string): Observable<any> {
    const url = `${this.apiUrl}/${roleId}/permissions/${permission}`;
    return this.http.delete(url);
  }

  addPermissionToRole(roleId: string, permission: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${roleId}/permissions/${permission}`, {});
  }


}
