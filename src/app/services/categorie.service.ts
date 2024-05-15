import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout categorie
  addCategorie(categorie: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterCategorie`, categorie);
  }

  // liste categorie
  getAllCategorie(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerCategorieClient`);
  }

  //modifier un categorie
  updateCategorie(categorieId: any, categorie:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierCategorie/${categorieId}`, categorie);
  }

   // supprimer un categorie
   deleteCategorie(categorieId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerCategorie/${categorieId}`);
  }
}
