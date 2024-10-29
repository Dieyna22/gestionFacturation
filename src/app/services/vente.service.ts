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
  configNumero(numeroFacture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/configurerNumeros`, numeroFacture);
  }

  // liste NuméroFacture
  getAllNumeroFacture(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationFacture`);
  }

  // liste NuméroDevis
  getAllNumeroDevis(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationDevis`);
  }

  // liste NuméroBonCommande
  getAllNumeroBonCommande(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationBonCommande`);
  }

  // liste NuméroBonLivraison
  getAllNumeroBonLivraison(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationLivraison`);
  }

  // liste NuméroFournisseur
  getAllNumeroFournisseur(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationFournisseur`);
  }

  // liste NuméroDépense
  getAllNumeroDepense(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/InfoConfigurationDepense`);
  }

  // crée facture 
  createFacture(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFacture`, facture);
  }


  // liste de tous les factures
  getAllFacture(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesFacturesSimpleAvoir`);
  }

  // crée facture d'acompte
  createFactureAcompte(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFactureAccomp`, facture);
  }

  // crée facture d'avoir
  createFactureAvoir(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFactureAvoir`, facture);
  }

  // crée solde
  createSolde(clientId: any, solde: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterSolde/${clientId}`, solde);
  }

  // cree facture recurrente
  createFactureRecurrente(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerFactureRecurrente`, facture);
  }

  // liste facture recurrente
  getAllFactureRecurrente(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesFacturesRecurrentes`);
  }

  // liste accompte par facture
  getAcompteBYfacture(numFacture: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerfactureAccomptsParFacture/${numFacture}`);
  }


  // liste facture d'immediat
  getAllFactureImmediat(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerFactures`);
  }

  // liste facture d'echèance
  getAllFactureEcheance(): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listerFacturesEcheance`, '');
  }

  // liste facture d'acompte
  getAllFactureAcompte(): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listerFacturesAccompt`, '');
  }

  // liste facture d'avoir
  getAllFactureAvoir(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesFacturesAvoirs`);
  }

  // valider facture
  validerFacture(facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/validerFacture`, facture);
  }

  // supprimer facture
  deleteFacture(factureId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerFacture/${factureId}`);
  }

  // supprimer facture d'avoir
  deleteFactureAvoir(factureId: any): Observable<any> {
    return this.http.post(`${apiUrl}/supprimerFactureAvoir/${factureId}`, '');
  }

  // detail des factures
  DetailFacture(factureId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/DetailsFacture/${factureId}`);
  }


  // liste echeance par facture
  echeanceParFacture(factureId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listEcheanceParFacture/${factureId}`, '');
  }

  // liste acompte par facture
  acompteParFacture(factureId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerfactureAccomptsParFacture/${factureId}`);
  }

  // transformer echeance en payement
  payerEcheance(echeanceId: any, facture: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/transformerEcheanceEnPaiementRecu/${echeanceId}`, facture);
  }

  // liste payement reçu par facture
  paymentRecuParFacture(factureId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/listPaiementsRecusParFacture/${factureId}`, '');
  }

  // transformer payement en echeance
  PaiementEnEcheance(echeanceId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/transformerPaiementRecuEnEcheance/${echeanceId}`, '');
  }

  // crée devis
  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerDevi`, devis);
  }

  // liste devis
  getAllDevis(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesDevi`);
  }

  // supprimer devis
  deleteDevis(devisId: any): Observable<any> {
    return this.http.post(`${apiUrl}/supprimerDevi/${devisId}`, '');
  }

  // annuler devis
  annulerDevis(devisId: any): Observable<any> {
    return this.http.post(`${apiUrl}/annulerDevi/${devisId}`, '');
  }

  // details devis
  detailDevis(devisId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/DetailsDevis/${devisId}`, '');
  }

  // transfomer devis en facture
  transformerDevisEnFacture(devisId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/TransformeDeviEnFacture/${devisId}`, '');
  }

  // transfomer devis en bon de commande
  transformerDevisEnCommande(devisId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/TransformeDeviEnBonCommande/${devisId}`, '');
  }


  // créer bon de commande
  createBonCommande(bonCommande: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerBonCommande`, bonCommande);
  }

  // liste bon de commande
  getAllBonCommande(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerTousBonCommande`);
  }

  // supprimer bon de commande
  deleteBonCommande(bonCommandeId: any): Observable<any> {
    return this.http.post(`${apiUrl}/supprimerBonCommande/${bonCommandeId}`, '');
  }

  // annuler bon de commande
  annulerBonCommande(bonCommandeId: any): Observable<any> {
    return this.http.post(`${apiUrl}/annulerBonCommande/${bonCommandeId}`, '');
  }

  // details bon de commande
  detailBonCommande(bonCommandeId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/DetailsBonCommande/${bonCommandeId}`, '');
  }

  // transformer bon de commande en facture
  transformerCommandEnFacture(bonCommandeId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/TransformeBonCommandeEnFacture/${bonCommandeId}`, '');
  }


  // créer un bon de livraison
  createBonLivraison(bonLivraison: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterLivraison`, bonLivraison);
  }

  // liste bon de livraison
  getAllBonLivraison(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesLivraisons`);
  }

  // detail bon de livraison
  detailBonLivraison(bonLivraisonId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/DetailsLivraison/${bonLivraisonId}`, '');
  }

  // supprimer bon de livraison
  deleteBonLivraison(bonLivraisonId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerLivraison/${bonLivraisonId}`);
  }

  // livraison en preparation
  livraisonEnPreparation(bonLivraisonId: any): Observable<any> {
    return this.http.post(`${apiUrl}/LivraisonPreparer/${bonLivraisonId}`, '');
  }

  // livraison réaliser
  livraisonRealiser(bonLivraisonId: any): Observable<any> {
    return this.http.post(`${apiUrl}/RealiserLivraison/${bonLivraisonId}`, '');
  }

  // livraison planifiée
  livraisonPlanifier(bonLivraisonId: any): Observable<any> {
    return this.http.post(`${apiUrl}/PlanifierLivraison/${bonLivraisonId}`, '');
  }

  // transformer livraison en facture
  transformerLivraisonEnFacture(bonLivraisonId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/transformerLivraisonEnFacture/${bonLivraisonId}`, '');
  }

  // ajouter fournisseur
  createFournisseur(fournisseur: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterFournisseur`, fournisseur);
  }

  // liste fournisseur
  getAllFournisseur(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerTousFournisseurs`);
  }

  // supprimer fournisseur
  deleteFournisseur(fournisseurId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerFournisseur/${fournisseurId}`);
  }

  // modifier fournisseur
  updateFournisseur(fournisseurId: any, fournisseur: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierFournisseur/${fournisseurId}`, fournisseur);
  }

  // ajout categorie depense
  createCategorieDepense(categorieDepense: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ajouterCategorieDepense`, categorieDepense);
  }

  // liste categorie depense
  getAllCategorieDepense(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerCategorieDepense`);
  }

  // creer depense
  createDepense(depense: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/creerDepense`, depense);
  }

  // liste depense
  getAllDepense(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerDepenses`);
  }

  // supprimer depense
  deleteDepense(depenseId: any): Observable<any> {
    return this.http.delete(`${apiUrl}/supprimerDepense/${depenseId}`);
  }

  // modifier depense
  updateDepense(depenseId: any, depense: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/modifierDepense/${depenseId}`, depense);
  }

  // exporter vente
  exportVenteToExcel() {
    return this.http.get(`${apiUrl}/exportFactures`, { responseType: 'blob' });
  }

  // exporter devis
  exportDevisToExcel() {
    return this.http.get(`${apiUrl}/exporterDevis`, { responseType: 'blob' });
  }

  // exporter bon de commande
  exportBonCommandeToExcel() {
    return this.http.get(`${apiUrl}/exporterBonCommandes`, { responseType: 'blob' });
  }

  // exporter bon de livraison
  exportBonLivraisonToExcel() {
    return this.http.get(`${apiUrl}/exporterLivraison`, { responseType: 'blob' });
  }

  // exporter depense
  exportDepenseToExcel() {
    return this.http.get(`${apiUrl}/exporterDepenses`, { responseType: 'blob' });
  }

  // liste facture par  client
  getAllFactureByClient(clientId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeFactureParClient/${clientId}`);
  }

  // liste devis par client
  getAllDevisByClient(clientId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeDeviParClient/${clientId}`);
  }

  // liste bon de commande par client
  getAllBonCommandeByClient(clientId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeBonCommandeParClient/${clientId}`);
  }

   // liste bon de livraison par client
   getAllBonLivraisonByClient(clientId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerToutesLivraisonsParClient/${clientId}`);
  }

   // liste des soldes par client
   getAllSoldeByClient(clientId: any): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listeSoldeParClient/${clientId}`);
  }

  // telecharger pdf facture
  genererPdf(factureId: any,modelDocumentId:any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/genererPDFFacture/${factureId}/${modelDocumentId}`, '');
  }


 


  // detail email facture
  detailEmailFacture(factureId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/DetailEmailFacture_genererPDF/${factureId}`, '');
  }

}
