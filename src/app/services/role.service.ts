import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout role
  addRole(role: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterRole`, role);
  }
}
