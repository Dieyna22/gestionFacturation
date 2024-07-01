import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class PayementService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout payement
  addPayement(payement: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterPayement`, payement);
  }

  // liste payement
  getAllPayement(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerPayements`);
  }

  //modifier un payement
  updatePayement(payementId: any, payement:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierPayement/${payementId}`, payement);
  }

   // supprimer un cpayement
   deletePayement(payementId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerPayement/${payementId}`);
  }
}
