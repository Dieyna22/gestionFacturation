import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  // inscription
  inscription(user: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/register`, user);
  }

  // connexion Admin
  connexionAdmin(admin: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/login`, admin);
  }

  // connexion Admin
  connexionUser(user: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/login_sousUtilisateur`, user);
  }

  //refresh token
  refreshToken(): Observable<any> {
    return this.http.post(`${apiUrl}/refresh`, {});
  }
}
