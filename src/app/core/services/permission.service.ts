import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../models/role';
import {Permission} from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl = 'http://localhost:3333/api/v1/settings/permission';

  constructor(private http: HttpClient) { }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }


  getPermissionById(id: string): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  addPermission(permission: Permission): Observable<any> {
    return this.http.post(`${this.apiUrl}`, permission);
  }


  deletePermission(idPermission: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idPermission}`);
  }

  updatePermission(idPermission: string , permission: Permission): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idPermission}`, permission);
  }
}
