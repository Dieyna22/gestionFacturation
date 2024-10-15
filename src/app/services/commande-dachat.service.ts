import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CommandeDachatService {

  constructor(private http: HttpClient, private router: Router) { }

  // liste Numéro commande d'achat
  getAllNumeroCommandeDachat(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationCommandeAchat`);
  }

  // ajout commande d'achat
  addCommandeDachat(achat: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerCommandeAchat`, achat);
  }

  // liste commande d'achat
  getAllCommandeDachat(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesCommandesAchat`);
  }

  // supprimer  un commande d'achat
  deleteCommandeDachat(CommandeDachatID: any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/supprimerCommandeAchat/${CommandeDachatID}`);
  }

  //modifier un commande d'achat
  updateCommandeDachat(CommandeDachatID: any, CommandeDachat: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierCommandeAchat/${CommandeDachatID}`, CommandeDachat);
  }

  //annuler un commande d'achat
  annulerCommandeDachat(CommandeDachatID: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/annulerCommandeAchat/${CommandeDachatID}`, '');
  }

  // exporter commande d'achat
  exportToExcel() {
    return this.http.get(`${apiUrl}/exporterCommandesAchats`, { responseType: 'blob' });
  }

  // detail mail commande d'achat
  DetailEmailCommandeAchat(CommandeDachatID: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/DetailEmailCommandeAchat_genererPDF/${CommandeDachatID}`, '');
  }

  // envoie mail commande d'achat
  envoieEmailCommandeAchat(CommandeDachatID: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/envoyerEmailCommandeAchat/${CommandeDachatID}`, '');
  }

}
