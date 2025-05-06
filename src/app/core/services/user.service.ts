import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponse} from '../models/userResponse';
import {UserRequest} from '../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3333/api/v1/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }
  //
  //
  // deleteRole(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
  //
  // updateRole(role: Role): Observable<any> {
  //   return this.http.put(`${this.apiUrl}`, role);
  // }
}
