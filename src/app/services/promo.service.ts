import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout promo
  addPromo(promo: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterPromo`, promo);
  }

  // liste clients
  getAllPromo(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerPromo`);
  }

   // supprimer  un promo
   deletePromo(promoId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/supprimerPromo/${promoId}`,"");
  }

  //modifier un client
    updatePromo(promoId: any, promo:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierPromo/${promoId}`, promo);
  }
}
