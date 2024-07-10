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


  // Configuration numéro facture
  configNumero(numeroFacture:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/configurerNumeros`,numeroFacture);
  }

  // listeNuméroFacture
  getAllNumeroFacture(): Observable<any> {
    return this.http.post<any>(`${apiUrl}/InfoConfigurationFacture`,'');
  }

  // crée facture 
  createFacture(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFacture`, facture);
  }


  // liste facture
  getAllFacture(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerFactures`);
  }

   // crée facture d'acompte
   createFactureAcompte(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFactureAccomp`, facture);
  }


  // liste facture
  getAcompteBYfacture(numFacture:any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerfactureAccomptsParFacture/${numFacture}`);
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

  // detail des factures
  DetailFacture(factureId:any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/DetailsFacture/${factureId}`);
  }

  // liste echeance par facture
  echeanceParFacture(factureId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listEcheanceParFacture/${factureId}`, '');
  }

  // liste acompte par facture
  acompteParFacture(factureId:any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerfactureAccomptsParFacture/${factureId}`);
  }

  // transformer echeance en payement
  payerEcheance(echeanceId:any , facture:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/transformerEcheanceEnPaiementRecu/${echeanceId}`, facture);
  }

   // liste payement reçu par facture
  paymentRecuParFacture(factureId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listPaiementsRecusParFacture/${factureId}`, '');
  }

  // transformer payement en echeance
  PaiementEnEcheance(echeanceId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/transformerPaiementRecuEnEcheance/${echeanceId}`, '');
  }

}
