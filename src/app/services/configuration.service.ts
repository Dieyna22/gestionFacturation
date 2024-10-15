import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient, private router: Router) { }

  // liste historiques
  getHistory(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerMessagesHistoriqueAujourdhui`);
  }

  // enregistrer model document
  saveModel(modelDoc: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/CreerModelDocument`, modelDoc);
  }

  // liste model par type de document
  getModelByTypeDocument(typeDocument: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerModelesDocumentsParType/${typeDocument}`);
  }

  // modifier model document 
  updateModel(modelDoc: any, iDModel: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ModifierModelDocument/${iDModel}`, modelDoc);
  }

  // configuration modele mail
  saveModelMail(modelMail: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/createEmailModele`, modelMail);
  }

  // configuration notification
  configNotification(notif: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/configurerNotification`, notif);
  }

  // liste configuration notification
  getAllConfignotification(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerConfigurationNotification`);
  }

  // liste notification
  getNotification(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerNotifications`);
  }

  // supprimer notification
  deleteNotification(messageNotif:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/supprimeNotificationParType`,messageNotif);
  }

  // configuration relance automatique
  configRelance(relance: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ConfigurerRelanceAuto`, relance);
  }

  // liste configuration relance automatique
  getAllRelance(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerConfigurationRelance`);
  }
}
