import { Injectable } from '@angular/core';
import { UserRole, User } from '../models/user.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = 'http://localhost:8089/realms/bdcc_realm/protocol/openid-connect/token';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'gesproPlus_client-ang')
      .set('client_secret', '2nCGkl4ajccclk38whlAf5CUMkITdNyN')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.tokenUrl, body.toString(), { headers });
  }




}
