import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  constructor(private http: HttpClient, private router: Router) { }

  // crée facture 
  createFacture(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFacture`, facture);
  }

  // liste facture
  getAllFacture(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerFactures`);
  }

  // liste facture d'immediat
  getAllFactureImmediat(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerFactures`);
  }

   // liste facture d'echèance
   getAllFactureEcheance(): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listerFacturesEcheance`,'');
  }

   // liste facture d'acompte
   getAllFactureAcompte(): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listerFacturesAccompt`,'');
  }

   // valider facture
   validerFacture(facture:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/validerFacture`, facture);
  }

   // supprimer facture
   deleteFacture(factureId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimeArchiveFacture/${factureId}`);
  }
}
