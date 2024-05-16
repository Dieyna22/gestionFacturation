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
}
