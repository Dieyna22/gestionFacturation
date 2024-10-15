import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class EtiquetteService {

  
  constructor(private http: HttpClient, private router: Router) { }

  // ajout etiquette
  addEtiquette(etiquette: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerEtiquette`, etiquette);
  }

  // liste etiquette
  getAllEtiquette(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/ListerEtiquette`);
  }

   // supprimer  une etiquette
   deleteEtiquette(etiquetteID:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/supprimerEtiquette/${etiquetteID}`,"");
  }

  //modifier une etiquette
  updateEtiquette(etiquetteID: any, etiquette:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierEtiquette/${etiquetteID}`, etiquette);
  }
}
