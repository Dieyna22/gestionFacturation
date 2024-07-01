import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';


@Injectable({
  providedIn: 'root'
})
export class GrilleTarifaireService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout grille tarifaire
  addGrille(grille: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerGrilleTarifaire`, grille);
  }

  // liste grille tarifaire
  getAllGrille(clientId:any,articleId:any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerTariPourClientSurArticle/${clientId}/${articleId}`);
  }

  // modifier un grille tarifaire
  updateGrille(grilleId: any, grille:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierGrilleTarifaire/${grilleId}`, grille);
  }

   // supprimer un grille tarifaire
   deleteGrille(grilleId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerGrilleTarifaire/${grilleId}`);
  }
}
