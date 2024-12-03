import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ConfigurationService } from 'src/app/services/configuration.service';



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
  userprenom: string = '';
  usermail: string = '';
  entreprise: string = '';


  constructor(private route: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private userService: UtilisateurService, private configService: ConfigurationService) { }

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.nom = this.dbUsers.token.user.name;
    this.role = this.dbUsers.token.user.role;
    this.entreprise = this.dbUsers.token.user.nom_entreprise;
    this.usermail = this.dbUsers.token.user.email;
    this.usernom = this.dbUsers.token.user.nom;
    this.userprenom = this.dbUsers.token.user.prenom;
    this.getInfoAdmin();
    this.getNotification();
    this.getRelance();
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
        localStorage.setItem("isUsers", JSON.stringify(false));
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

  // Variables pour stocker les valeurs
  quantite_produit: number = 10;
  nombre_jourNotif_brouillon: number = 7;
  nombre_jourNotif_depense: number = 7;
  nombre_jourNotif_echeance: number = 7;
  nombre_jourNotif_devi: number = 7;


  sliders = [
    { label: 'Les produits avec moins de :', value: 10, unit: 'unités' },
    { label: 'Les brouillons non validés après :', value: 7, unit: 'jours' },
    { label: 'Les dépenses des prochains :', value: 7, unit: 'jours' },
    { label: 'Les échéances (paiements) prévues des prochains :', value: 7, unit: 'jours' },
    { label: 'Les devis expirés des prochains :', value: 7, unit: 'jours' }
  ];

  // Mettre à jour les variables quand les sliders changent
  updateVariables() {
    this.quantite_produit = this.sliders[0].value;
    this.nombre_jourNotif_brouillon = this.sliders[1].value;
    this.nombre_jourNotif_depense = this.sliders[2].value;
    this.nombre_jourNotif_echeance = this.sliders[3].value;
    this.nombre_jourNotif_devi = this.sliders[4].value;
  }

  changeValue(index: number, increment: number): void {
    const newValue = this.sliders[index].value + increment;
    if (newValue >= 0 && newValue <= 99) {
      this.sliders[index].value = newValue;
      this.updateVariables();
    }
  }

  // Pour l'input du slider
  onSliderChange() {
    this.updateVariables();
  }


  isChecked = false;
  sliderValue: number = 0;
  isAfterChecked = false;
  afterSliderValue: number = 0;

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
    this.sliderValue = Number(event);
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
    this.afterSliderValue = Number(event);
  }

  selectedTemplate = 'facture';
  selectedVariable = '';

  emailTemplates: Record<string, EmailTemplate> = {
    'facture': {
      object: "Facture {VENTE_NUMERO} du {VENTE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint la facture N° {VENTE_NUMERO} du {VENTE_DATE} pour un montant de {VENTE_PRIX_TOTAL}.

Nous vous remercions pour votre règlement.

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'VENTE_NUMERO', 'VENTE_DATE', 'VENTE_PRIX_TOTAL']
    },
    'resumer_vente': {
      object: "Résumé de la vente {VENTE_NUMERO} du {VENTE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le résumé de la Vente N° {VENTE_NUMERO} du {VENTE_DATE} pour un montant de {VENTE_PRIX_TOTAL}.

Nous vous remercions de votre confiance.

À bientôt !

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'VENTE_NUMERO', 'VENTE_DATE', 'VENTE_PRIX_TOTAL']
    },
    'recu_paiement': {
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
    'relanceAvant_echeance': {
      object: "Rappel d'échéance du {ECHEANCE_DATE} - Facture {VENTE_NUMERO}",
      body: `Bonjour {DESTINATAIRE},

Nous vous rappelons que le {ECHEANCE_DATE} vous devez effectuer le paiement de {ECHEANCE_MONTANT} concernant la Facture N° {VENTE_NUMERO} (ci-joint).

Si vous avez déjà effectué le paiement en question, s'il vous plaît ignorez ce message.. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'ECHEANCE_DATE', 'ECHEANCE_MONTANT', 'VENTE_NUMERO', 'VENTE_DATE']
    },
    'relanceApres_echeance': {
      object: "Rappel d'échéance du {ECHEANCE_DATE} - Facture {VENTE_NUMERO}",
      body: `Bonjour {DESTINATAIRE},

Sauf erreur de notre part, nous constatons qu'à ce jour vous n'avez pas effectué le paiement de {ECHEANCE_MONTANT} prévu pour le {ECHEANCE_DATE} concernant la Facture N° {VENTE_NUMERO} (ci-joint).

Si vous avez déjà effectué le paiement en question, s'il vous plaît ignorez ce message.. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'ECHEANCE_DATE', 'ECHEANCE_MONTANT', 'VENTE_NUMERO', 'VENTE_DATE']
    },
    'devi': {
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
    'commande_vente': {
      object: "Commande {COMMANDE_NUMERO} réalisée le {COMMANDE_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le Bon de Commande N° {COMMANDE_NUMERO} réalisé le {COMMANDE_DATE} pour un montant de {COMMANDE_PRIX_TOTAL}.

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter. 

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'COMMANDE_NUMERO', 'COMMANDE_VenteDate', 'COMMANDE_VentePrixTotal']
    },
    'livraison': {
      object: "Livraison {LIVRAISON_NUMERO} prévue le {LIVRAISON_DATE}",
      body: `Bonjour {DESTINATAIRE},

Veuillez trouver ci-joint le Bon de Livraison N° {LIVRAISON_NUMERO}.

Livraison prévue le : {LIVRAISON_DATE}.

Si vous avez besoin d'informations supplémentaires, n'hésitez pas à nous contacter.

Cordialement,
{ENTREPRISE}`,
      variables: ['Nom_Entreprise', 'Nom_Destinataire', 'Liste produits/Services', 'LIVRAISON_NUMERO', 'LIVRAISON_DATE', 'LIVRAISON_PRIX_TOTAL']
    },
    'fournisseur': {
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

  BeforeRelance() {
    this.selectedTemplate = 'relanceAvant_echeance';
  }

  AfterRelance() {
    this.selectedTemplate = 'relanceApres_echeance';
  }

  inputprenom: string = "";
  inputnom: string = "";
  inputmail: string = "";
  inputpassactuel: string = "";
  inputpassnew: string = "";

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  password: boolean = false;
  showUpdatePassword() {
    this.password = !this.password
  }

  updatePassword() {
    let pass = {
      mot_de_passe_actuel: this.inputpassactuel,
      nouveau_mot_de_passe: this.inputpassnew
    }
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous modifier Votre mot de passe?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.userService.password(pass).subscribe(
          (response) => {
            Notify.success(response.message);
            Loading.remove();
          }
        )
      });
  }

  adminInfos: any;
  getInfoAdmin() {
    this.userService.getAdmi().subscribe(
      (response) => {
        this.adminInfos = response.user;
        this.inputnom = this.adminInfos[0].name;
        //  this.inputprenom = this.adminInfos.prenom;
        this.inputmail = this.adminInfos[0].email;
        console.log(this.adminInfos);
        console.log(this.inputnom);
        console.log(this.inputprenom);
        console.log(this.inputmail);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  saveModelMail() {
    let model = {
      "type_modele": this.selectedTemplate,
      "object": this.currentTemplate.object,
      "contenu": this.currentTemplate.body
    }

    this.configService.saveModelMail(model).subscribe(
      (response) => {
        console.log(response);
        Report.success('Notiflix Success', response.message, 'Okay',);
      },
      (error) => {
        console.log(error);
      }
    )

  }
  // Variables pour les notifications
  notif_rupture: boolean = false;
  notif_depense: boolean = false;
  notif_paiement: boolean = false;
  notif_devis: boolean = false;
  notif_relance: boolean = false;
  notif_anniversaire: boolean = false;
  notif_email: boolean = false;

  notification() {
    let notification =
    {
      "produit_rupture": this.notif_rupture ? '1' : '0',
      "depense_impayer": this.notif_depense ? '1' : '0',
      "payement_attente": this.notif_paiement ? '1' : '0',
      "devis_expirer": this.notif_devis ? '1' : '0',
      "relance_automatique": this.notif_relance ? '1' : '0',
      "quantite_produit": this.quantite_produit,
      "nombre_jourNotif_brouillon": this.nombre_jourNotif_brouillon,
      "nombre_jourNotif_depense": this.nombre_jourNotif_depense,
      "nombre_jourNotif_echeance": this.nombre_jourNotif_echeance,
      "nombre_jourNotif_devi": this.nombre_jourNotif_devi,
      "recevoir_notification": this.notif_email ? '1' : '0'
    }
    this.configService.configNotification(notification).subscribe(
      (response) => {
        console.log(response);
        Report.success('Notiflix Success', response.message, 'Okay',);
        this.getNotification();
        this.updateNotificationSettings(response.data);

      },
      (error) => {
        console.log(error);
      }
    )
  }

  listeConfigNotif: any[] = [];
  getNotification() {
    this.configService.getAllConfignotification().subscribe(
      (response) => {
        this.listeConfigNotif = response.data[0];
        console.log(this.listeConfigNotif)
        this.updateNotificationSettings(this.listeConfigNotif)
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // Méthode pour mettre à jour les états avec la réponse du backend
  updateNotificationSettings(response: any) {
    // Mise à jour des checkboxes
    this.notif_rupture = response.produit_rupture;
    this.notif_depense = response.depense_impayer;
    this.notif_paiement = response.payement_attente;
    this.notif_devis = response.devis_expirer;
    this.notif_relance = response.relance_automatique;
    this.notif_email = response.recevoir_notification;

    // Mise à jour des sliders
    this.quantite_produit = response.quantite_produit;
    this.nombre_jourNotif_brouillon = response.nombre_jourNotif_brouillon;
    this.nombre_jourNotif_depense = response.nombre_jourNotif_depense;
    this.nombre_jourNotif_echeance = response.nombre_jourNotif_echeance;
    this.nombre_jourNotif_devi = response.nombre_jourNotif_devi;

    // Mise à jour des valeurs dans le tableau sliders
    this.sliders[0].value = this.quantite_produit;
    this.sliders[1].value = this.nombre_jourNotif_brouillon;
    this.sliders[2].value = this.nombre_jourNotif_depense;
    this.sliders[3].value = this.nombre_jourNotif_echeance;
    this.sliders[4].value = this.nombre_jourNotif_devi;
  }

  // Variables pour les relances automatiques
  rappel_avant: boolean = false;
  rappel_apres: boolean = false;

  relanceAutomatique() {
    let relance =
    {
      "envoyer_rappel_avant": this.rappel_avant ? '1' : '0',
      "nombre_jour_avant": this.sliderValue,
      "envoyer_rappel_apres": this.rappel_apres ? '1' : '0',
      "nombre_jour_apres": this.afterSliderValue
    }
    this.configService.configRelance(relance).subscribe(
      (response) => {
        console.log(response);
        Report.success('Notiflix Success', response.message, 'Okay',);
        this.getRelance();
        this.updateRelanceSettings(response);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  listeRelance: any[] = [];
  getRelance() {
    this.configService.getAllRelance().subscribe(
      (response) => {
        this.listeRelance = response.data[0];
        console.log(this.listeRelance)
        this.updateRelanceSettings(this.listeRelance)
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // Méthode pour mettre à jour les états avec la réponse du backend
  updateRelanceSettings(response: any) {
    this.rappel_apres = response.envoyer_rappel_apres;
    this.rappel_avant = response.envoyer_rappel_avant;
    this.sliderValue = response.nombre_jour_avant;
    this.afterSliderValue = response.nombre_jour_apres
    if (response.envoyer_rappel_apres = 1) {
      this.isChecked = true;
    } else {
      this.isChecked = false
    }

    if (response.envoyer_rappel_avant = 1) {
      this.isAfterChecked = true;
    } else {
      this.isAfterChecked = false
    }
  }

}
