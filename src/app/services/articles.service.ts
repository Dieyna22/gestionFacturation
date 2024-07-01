import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout article
  addArticle(article: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterArticle`, article);
  }

  // liste articles
  getAllArticles(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerArticles`);
  }

   // supprimer  une article
   deleteArticle(articleID:any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/supprimerArticle/${articleID}`);
  }

  //modifier une article
    updateArticle(articleID: any, article:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierArticle/${articleID}`, article);
  }

   //modifier stock  article
   updateStockArticle(articleID: any, stock:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/articles_modifier_quantite/${articleID}`, stock);
  }

  //affecter promo à une article
  affecterArticle(articleID: any, promo:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/affecterPromoArticle/${articleID}`, promo);
  }

   //affecter catégorie à une article
   affecterCategorieArticle(articleID: any, categorie:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/affecterCategorieArticle/${articleID}`, categorie);
  }

  // ajouter entrepot
  addEntrepot(entrepot: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterEntrepot`, entrepot);
  }

    // liste entrepot
    getAllEntrepot(): Observable<any> {
      return this.http.get<any>(`${apiUrl}/listerEntrepots`);
    }

    // liste autre prix par article
    getOtherPriceByArticle(articleId: any): Observable<any> {
      return this.http.get<any>(`${apiUrl}/listerAutrePrixArticle/${articleId}`);
    }
}
