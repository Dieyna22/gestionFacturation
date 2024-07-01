import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CategorieArticleService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout categorie article
  addCategorieArticle(categorieArticle: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterCategorieArticle`, categorieArticle);
  }

  // liste categorie article
  getAllCategorieArticle(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerCategorieProduit`);
  }

   // liste categorie service
   getAllCategorieService(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerCategorieService`);
  }

  //modifier un categorie article
  updateCategorieArticle(categorieArticleId: any, categorieArticle:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierCategorieArticle/${categorieArticleId}`, categorieArticle);
  }

   // supprimer un categorie article
   deleteCategorieArticle(categorieArticleId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerCategorieArticle/${categorieArticleId}`);
  }
}
