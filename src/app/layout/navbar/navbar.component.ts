import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';



// Définir l'interface pour la réponse du login et du rafraîchissement du token
interface AuthResponse {
  access_token: string;
  expires_in: number;
}

interface EmailTemplate {
  object: string;
  body: string;
  variables: string[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  dbUsers: any;
  nom: string = '';
  role: string = '';
  usernom: string = '';
  usermail: string = '';



  constructor(private route: Router, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.nom = this.dbUsers.user.name;
    this.role = this.dbUsers.user.role;
    this.usernom = this.dbUsers.user.prenom;
    this.usermail = this.dbUsers.user.email;

  }

  logout() {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Déconnexion',
      'Voullez-vous vous Déconnecter?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        localStorage.removeItem('userOnline');
        this.route.navigate(['/connexion']);
        Loading.remove();

      });
  }

  // Rafraîchir le token
  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`http://127.0.0.1:8000/api/refresh-token`, {})
      .pipe(
        tap((response) => {
          // this.handleAuthResponse(response);
          console.log(response)
        }),
        catchError((error) => {
          this.logout(); // Déconnexion si l'échec de rafraîchissement
          return throwError(
            () => new Error('Échec du rafraîchissement du token')
          );
        })
      );
  }

  sliders = [
    { label: 'Les produits avec moins de :', value: 10, unit: 'unités' },
    { label: 'Les brouillons non validés après :', value: 7, unit: 'jours' },
    { label: 'Les dépenses des prochains :', value: 7, unit: 'jours' },
    { label: 'Les échéances (paiements) prévues des prochains :', value: 7, unit: 'jours' },
    { label: 'Les devis expirés des prochains :', value: 7, unit: 'jours' }
  ];
  
  changeValue(index: number, increment: number): void {
    const newValue = this.sliders[index].value + increment;
    if (newValue >= 0 && newValue <= 99) {
      this.sliders[index].value = newValue;
    }
  }
  

  isChecked = false;
  sliderValue = 0;
  isAfterChecked = false;
  afterSliderValue = 0;

  toggleCheck() {
    this.isChecked = !this.isChecked;
    this.cdr.detectChanges();
  }
  decreaseValue() {
    if (this.sliderValue > 0) {
      this.sliderValue--;
    }
  }

  increaseValue() {
    if (this.sliderValue < 99) {
      this.sliderValue++;
    }
  }

  updateSliderValue(event: Event) {
    this.sliderValue = parseInt((event.target as HTMLInputElement).value);
  }

  toggleAfterCheck() {
    this.isAfterChecked = !this.isAfterChecked;
    this.cdr.detectChanges();
  }

  decreaseAfterValue() {
    if (this.afterSliderValue > 0) {
      this.afterSliderValue--;
    }
  }

  increaseAfterValue() {
    if (this.afterSliderValue < 99) {
      this.afterSliderValue++;
    }
  }

  updateAfterSliderValue(event: Event) {
    this.afterSliderValue = parseInt((event.target as HTMLInputElement).value);
  }

  selectedTemplate = '0';
  selectedVariable = '';

  emailTemplates: Record<string, EmailTemplate> = {
    '0': {
      object: "Facture {FACTURE_NUMERO} du {FACTURE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint la facture N° {FACTURE_NUMERO} du {FACTURE_DATE} pour un montant de {FACTURE_MONTANT}.

Nous vous remercions pour votre règlement.

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'VENTE_NUMERO', 'VENTE_DATE', 'VENTE_PRIX_TOTAL']
    },
    '1': {
      object: "Résumé de la vente {VENTE_NUMERO} du {VENTE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le résumé de la Vente N° {VENTE_NUMERO} du {VENTE_DATE} pour un montant de {VENTE_PRIX_TOTAL}.

Nous vous remercions de votre confiance.

À bientôt !

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'VENTE_NUMERO', 'VENTE_DATE', 'VENTE_PRIX_TOTAL']
    },
    '2': {
      object: "Reçu {PAIEMENT_NUMERO} du paiement effectué le {PAIEMENT_DATE}",
      body: `Bonjour {DESTINATAIRE},

Nous vous confirmons la récéption de votre paiement effectué le {PAIEMENT_DATE} pour un montant de {PAYMENT_MONTANT}.

Ci-joint le Reçu associé N° {PAIEMENT_NUMERO}. 

Merci de votre paiement.

À bientôt !

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'PAIEMENT_NUMERO', 'PAIEMENT_DATE', 'PAYMENT_MONTANT']
    },
    '3': {
      object: "Rappel d'échéance du {ECHEANCE_DATE} - Facture {VENTE_NUMERO}",
      body: `Bonjour {DESTINATAIRE},

Nous vous rappelons que le {ECHEANCE_DATE} vous devez effectuer le paiement de {ECHEANCE_MONTANT} concernant la Facture N° {VENTE_NUMERO} (ci-joint).

Si vous avez déjà effectué le paiement en question, s'il vous plaît ignorez ce message.. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'ECHEANCE_DATE', 'ECHEANCE_MONTANT', 'VENTE_NUMERO', 'VENTE_DATE']
    },
    '4': {
      object: "Rappel d'échéance du {ECHEANCE_DATE} - Facture {VENTE_NUMERO}",
      body: `Bonjour {DESTINATAIRE},

Sauf erreur de notre part, nous constatons qu'à ce jour vous n'avez pas effectué le paiement de {ECHEANCE_MONTANT} prévu pour le {ECHEANCE_DATE} concernant la Facture N° {VENTE_NUMERO} (ci-joint).

Si vous avez déjà effectué le paiement en question, s'il vous plaît ignorez ce message.. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'ECHEANCE_DATE', 'ECHEANCE_MONTANT', 'VENTE_NUMERO', 'VENTE_DATE']
    },
    '5': {
      object: "Devis {DEVIS_NUMERO} réalisé le {DEVIS_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le Devis N° {DEVIS_NUMERO} réalisé le {DEVIS_DATE}.

Montant total du devis : {DEVIS_PRIX_TOTAL}. 

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter.

À bientôt !

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'DEVIS_NUMERO', 'DEVIS_DATE', 'DEVIS_PRIX_TOTAL']
    },
    '6': {
      object: "Commande {COMMANDE_NUMERO} réalisée le {COMMANDE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le Bon de Commande N° {COMMANDE_NUMERO} réalisé le {COMMANDE_DATE} pour un montant de {COMMANDE_PRIX_TOTAL}.

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'COMMANDE_NUMERO', 'COMMANDE_VenteDate', 'COMMANDE_VentePrixTotal']
    },
    '7': {
      object: "Livraison {LIVRAISON_NUMERO} prévue le {LIVRAISON_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le Bon de Livraison N° {LIVRAISON_NUMERO}.

Livraison prévue le : {LIVRAISON_DATE}.

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter.

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'LIVRAISON_NUMERO', 'LIVRAISON_DATE', 'LIVRAISON_PRIX_TOTAL']
    },
    '8': {
      object: "Commande d'achat {ACHAT_NUMERO} réalisée le {ACHAT_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint la Commande d'Achat N° {ACHAT_NUMERO} réalisée le {ACHAT_DATE} pour un montant de {ACHAT_PRIX_TOTAL}

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter.

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'ACHAT_NUMERO', 'ACHAT_DATE', 'ACHAT_PRIX_TOTAL']
    },
  };

  get currentTemplate(): EmailTemplate {
    return this.emailTemplates[this.selectedTemplate];
  }

  insertVariable(field: 'object' | 'body') {
    if (this.selectedVariable) {
      const element = document.getElementById(field === 'object' ? 'objectInput' : 'bodyTextarea') as HTMLInputElement | HTMLTextAreaElement;
      const cursorPos = element.selectionStart ?? element.value.length; // Utilise la fin du texte si null
      const textBefore = element.value.substring(0, cursorPos);
      const textAfter = element.value.substring(cursorPos);
      const newValue = textBefore + '{' + this.selectedVariable + '}' + textAfter;
      element.value = newValue;
      element.focus();
      const newCursorPos = cursorPos + this.selectedVariable.length + 2;
      element.setSelectionRange(newCursorPos, newCursorPos);

      // Mettre à jour le modèle
      this.emailTemplates[this.selectedTemplate][field] = newValue;
    }
  }

  BeforeRelance(){
    this.selectedTemplate = '3';
  }

  AfterRelance(){
    this.selectedTemplate = '4';
  }

}
