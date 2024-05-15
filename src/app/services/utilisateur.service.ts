import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from './apiUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout user
  addUser(role: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterUtilisateur`, role);
  }

  // liste user non archiver
  getAllUserNoArchiver(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeUtilisateurNonArchive`);
  }

   // liste user  archiver
   getAllUserArchiver(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeUtilisateurArchive`);
  }

   // archiver  un user
   archiver(userId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ArchiverSousUtilisateur/${userId}`, "");
  }

   // archiver  un user
   desarchiver(userId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/Des_ArchiverSousUtilisateur/${userId}`, "");
  }

    //modifier un user
    updateUser(userId: any, user:any): Observable<any> {
      return this.http.post<any>(`${apiUrl}/modifierSousUtilisateur/${userId}`, user);
    }
}
