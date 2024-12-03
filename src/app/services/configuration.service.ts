import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';



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
  deleteNotification(messageNotif: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/supprimeNotificationParType`, messageNotif);
  }

  // configuration relance automatique
  configRelance(relance: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ConfigurerRelanceAuto`, relance);
  }

  // liste configuration relance automatique
  getAllRelance(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/listerConfigurationRelance`);
  }

  //  filtre general 
  filterByTerm(list: any[], filterTerm: string, keys: string[]): any[] {
    if (!list || !filterTerm || !keys || keys.length === 0) return list;

    const filteredList = list.filter(item => {
      return keys.some(key => {
        if (item[key] && typeof item[key] === 'string') {
          return item[key].toLowerCase().includes(filterTerm.toLowerCase());
        }
        return false;
      });
    });

    // If no matches are found, show an alert and return the original list
    if (filteredList.length === 0) {
      // alert('Aucune correspondance trouvée');
      Report.info('Notiflix Success', 'Aucune correspondance trouvée', 'Okay',);
      // return list;
    }

    return filteredList;
  }

  // fermer modal
  closeModal() {
    // Récupère tous les modaux ouverts
    const modals = document.querySelectorAll('.modal.show');

    // Ferme chaque modal ouvert
    modals.forEach(modal => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      // modal.style.display = 'none';

      // Supprime le backdrop si présent
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.classList.remove('show');
        document.body.removeChild(backdrop);
      }
    });
  }


  

  // Variable pour stocker l'ID de l'intervalle
private logoutInterval: any;
private expirationTimer: any;

// 1. Fonction pour démarrer la session
startSession(token: string) {
  const loginTime = new Date().getTime(); // Heure de connexion actuelle
  // Enregistrer le token et le loginTime dans localStorage
  const userOnline = {
    token,
    loginTime,
  };
  localStorage.setItem('userOnline', JSON.stringify(userOnline));

  // Démarrer le minuteur de déconnexion
  this.setLogoutTimer();
  // Démarrer l'intervalle pour vérifier la déconnexion
  this.logoutInterval = setInterval(() => this.setLogoutTimer(), 30000); // Exécuter toutes les 30 secondes
}

// 2. Fonction de vérification de la session au démarrage
checkSessionOnLoad() {
  const userOnlineStr = localStorage.getItem('userOnline');
  if (userOnlineStr) {
    const userOnline = JSON.parse(userOnlineStr);
    const currentTime = new Date().getTime();
    const sessionTimeout = userOnline.loginTime + 58 * 60 * 1000; // 58 minutes en millisecondes

    // Vérifier si la session a expiré ou non
    if (currentTime < sessionTimeout) {
      // La session est valide, démarrer le timer
      this.logoutInterval = setInterval(() => this.setLogoutTimer(), 30000); // Exécuter toutes les 30 secondes
    } else {
      // La session est expirée, déconnecter l'utilisateur
      this.closeModal();
      this.logout();
    }
  }
}

// 3. Fonction de vérification de la session
setLogoutTimer() {
  const userOnlineStr = localStorage.getItem('userOnline');
  if (userOnlineStr) {
    const userOnline = JSON.parse(userOnlineStr);
    this.expirationTimer = userOnline?.loginTime;
  }
  const currentTime = new Date().getTime();
  const sessionTimeout = this.expirationTimer + 58 * 60 * 1000; // 58 minutes en millisecondes
  if (currentTime >= sessionTimeout) {
    this.closeModal();
    this.logout();
    return false; // La session a expiré
  }
  return true;
}

// 4. Fonction de déconnexion
logout() {
  localStorage.removeItem('userOnline');
  localStorage.setItem("isUsers", JSON.stringify(false));
  clearInterval(this.logoutInterval); // Annuler l'intervalle pour éviter des vérifications inutiles après déconnexion
  this.router.navigate(['']); // Rediriger vers la page de connexion
}


  // rapport flux de Trésorerie
  getRapportFluxTrésorerie(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportFluxTrésorerie`, data);
  }

  // rapport de vente(facture)
  getRapportFacture(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportFacture`, data);
  }

  // rapport depense
  getRapportDepense(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportDepense`, data);
  }

  // rapport Paiement Reçu
  getRapportPaiementRecu(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportPaiementRecu`, data);
  }

  // rapport Paiement en attents
  getRapportPaiement_enAttents(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportPaiement_enAttents`, data);
  }

  // rapport Commande Vente
  getRapportCommandeVente(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportCommandeVente`, data);
  }

  // rapport livraison 
  getRapportLivraison(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportLivraison`, data);
  }

  // rapport  moyen payement 
  getRapportMoyenPayement(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportMoyenPayement`, data);
  }

  // rapport  TVA 
  getRapportTVA(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportTVA`, data);
  }

  // rapport  resultat 
  getRapportResultat(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/RapportResultat`, data);
  }

  // rapport  Journal Ventes 
  getRapportJournalVentes(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/getJournalVentesEntreDates`, data);
  }

  // rapport  Journal d'achat 
  getRapportJournalDachat(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/getJournalAchatsEntreDates`, data);
  }

  // Rapport Valeur Stock 
  getRapportValeurStock(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/Rapport_Valeur_Stock`, data);
  }

}
