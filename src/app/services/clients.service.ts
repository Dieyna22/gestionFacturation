import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient, private router: Router) { }

  // ajout client
  addClient(client: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterClient`, client);
  }

  // liste clients
  getAllClients(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerClients`);
  }

   // supprimer  un client
   deleteClient(clientId:any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/supprimerClient/${clientId}`);
  }

  //modifier un client
    updateClient(clientId: any, client:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierClient/${clientId}`, client);
  }

  // exporter client
  exportToExcel() {
    return this.http.get(`${apiUrl}/exportClients`,{ responseType: 'blob' });
  }

  // ajout Convertion
  addConversation(conversation: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterConversation`, conversation);
  }

  // liste conversation
  getAllConversation() : Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerConversations`);
  }

   // liste conversation par client
   getAllConversationByClient(clientId: any) : Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerConversationsParClient/${clientId}`);
  }


   // supprimer  une conversation
   deleteConveration(clientId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/supprimerConversation/${clientId}`,'');
  }

  //modifier une conversation
    updateConversation(clientId: any, conversation:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierConversation/${clientId}`, conversation);
  }
}
