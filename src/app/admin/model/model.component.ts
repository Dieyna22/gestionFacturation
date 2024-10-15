import { Component, Renderer2, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { invoiceTemplateCss } from '../../../assets/invoice-template.css';
import { HttpClient } from '@angular/common/http';
import { InvoiceModel } from '../../services/facture-model'
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit, OnDestroy {
  isChecked: boolean = false;
  titre: string = 'Facture';
  private styleElement?: HTMLStyleElement;
  private observer?: MutationObserver;
  templateCss = invoiceTemplateCss;

  @ViewChild('fileInput') fileInput!: ElementRef;

  onAddSignature() {
    // Ouvre le sélecteur de fichiers
    this.fileInput.nativeElement.click();
  }

  imageSignatureExpediteur: any;
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageSignatureExpediteur = file; //a envoie au
      // Ici, vous pouvez gérer le fichier (par exemple, l'afficher ou l'enregistrer dans votre modèle)
      console.log('Fichier sélectionné:', this.imageSignatureExpediteur);
    }
  }

  ApercuImageSignatureExpediteur: any // Pour stocker l'aperçu de l'image

  ApercuOnFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérifier la taille du fichier
      if (file.size <= 1024 * 1024) { // Limite à 1 Mo
        const reader = new FileReader();
        reader.onload = (e) => {
          this.ApercuImageSignatureExpediteur = e.target?.result; // Mettre à jour avec l'URL de données
          console.log('Aperçu de l\'image:', this.ApercuImageSignatureExpediteur); // Vérifier l'aperçu
        };
        reader.readAsDataURL(file); // Lire le fichier comme URL de données
      } else {
        alert("La taille de l'image ne doit pas dépasser 1 MB.");
      }
    }
  }

  removeImage(): void {
    this.ApercuImageSignatureExpediteur = null; // Réinitialiser l'aperçu
  }


  @ViewChild('fileInputOther') fileInputOther!: ElementRef;

  onAddSignatureOther() {
    // Ouvre le sélecteur de fichiers
    this.fileInputOther.nativeElement.click();
  }

  autreImage: any;
  onFileSelectedOther(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.autreImage = file;
      // Ici, vous pouvez gérer le fichier (par exemple, l'afficher ou l'enregistrer dans votre modèle)
      console.log('Fichier sélectionné:', this.autreImage);
    }
  }

  ApercuAutreImage: any // Pour stocker l'aperçu de l'image

  ApercuOnFileSelectedOther(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérifier la taille du fichier
      if (file.size <= 1024 * 1024) { // Limite à 1 Mo
        const reader = new FileReader();
        reader.onload = (e) => {
          this.ApercuAutreImage = e.target?.result; // Mettre à jour avec l'URL de données
          console.log('Aperçu de l\'image:', this.ApercuAutreImage); // Vérifier l'aperçu
        };
        reader.readAsDataURL(file); // Lire le fichier comme URL de données
      } else {
        alert("La taille de l'image ne doit pas dépasser 1 MB.");
      }
    }
  }

  removeOtherImage(): void {
    this.ApercuAutreImage = null; // Réinitialiser l'aperçu
  }



  // Gestion bouton
  boutonActif = 1;

  //model active
  modelActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = 'facture';

  ngOnInit(): void {
    this.listeInfoSup();
    this.listeModelByTypeDocument();
    this.createStyleElement();
    this.setupObserver();
  }

  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
    this.titre = contentId;
  }
  currentModel: string = 'bloc'

  // Mettre à jour le modèle actuel
  showModel(modelId: string): void {
    this.currentModel = modelId;
  }

  // color: string = '#467aea';

  // onColorChange() {
  //   this.updateTableHeaderColor();

  // }
  // private updateTableHeaderColor() {
  //   const theadCells = document.querySelectorAll('thead tr th');
  //   const titreZone = document.querySelector('h1')
  //   theadCells.forEach((cell: any) => {
  //     this.renderer.setStyle(cell, 'background-color', this.color);
  //     this.renderer.setStyle(cell, 'color', 'white')
  //   });
  // }

  constructor(private renderer: Renderer2, private userService: UtilisateurService, private http: HttpClient, private configModel: ConfigurationService) {
    this.currentDate = this.getCurrentDate();
  }

  currentDate: string;

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }

  InfoSup: any;
  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup = infoSup.user;
        console.log(this.InfoSup)
      },
      (err) => {
      }
    )
  }

  showConfig: boolean = false;
  onshowConfig() {
    this.showConfig = !this.showConfig;
  }

  // varaible pour ajouter des options sur le model des document
  showSignatureExpediteur: boolean = false;
  showSignatureDestinataire: boolean = false;
  showAutresImages: boolean = false;
  showConditionsPaiement: boolean = false;
  showCoordonneesBancaires: boolean = false;
  showNotePiedPage: boolean = false;

  mentionExpediteur = '';
  mentionDestinataire = '';
  conditionsPaiement = '';
  titulaireCompte = '';
  banque = '';
  compte = '';
  notePiedPage = '';
  typeDocument = 'vente';

  setTypeDocument(typeDoc: string) {
    this.typeDocument = typeDoc;
  }

  toggleSection(section: string, value: boolean) {
    switch (section) {
      case 'showSignatureExpediteur':
        this.showSignatureExpediteur = value;
        break;
      case 'showSignatureDestinataire':
        this.showSignatureDestinataire = value;
        break;
      case 'showAutresImages':
        this.showAutresImages = value;
        break;
      case 'showConditionsPaiement':
        this.showConditionsPaiement = value;
        break;
      case 'showCoordonneesBancaires':
        this.showCoordonneesBancaires = value;
        break;
      case 'showNotePiedPage':
        this.showNotePiedPage = value;
        break;
    }
  }
  ajouterSignature(type: 'expediteur' | 'destinataire') {
    console.log(`Ajouter signature ${type}`);
  }

  ajouterImage() {
    console.log('Ajouter image');
  }

  signatureExpediteur: boolean = false
  afficherSignatureExpediteur() {
    this.signatureExpediteur = !this.signatureExpediteur;
  }

  signatureDestinataire: boolean = false
  afficherSignatureDestinataire() {
    this.signatureDestinataire = !this.signatureDestinataire;
  }

  updateTemplateCss(): void {
    // Rechercher et remplacer la valeur de `--header-color` par la nouvelle couleur
    this.templateCss = this.templateCss.replace(/--header-color:\s*#[0-9a-fA-F]{6};/, `--header-color: ${this.headerColor};`);
    console.log('Template CSS mis à jour:', this.templateCss);
  }

  saveModel() {
    const selectedColor = this.headerColor; // couleur sélectionnée
    console.log('Couleur envoyée au backend:', selectedColor);
    const formData = this.prepareFormData();

    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });

    Confirm.show(
      'Confirmation',
      'Voulez-vous sauvegarder ce modèle?',
      'Oui',
      'Non',
      () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();

        this.configModel.saveModel(formData).subscribe({
          next: (reponse) => {
            console.log(reponse);
            Report.success('Notiflix Success', reponse.message, 'Okay');
            Loading.remove();
            this.listeModelByTypeDocument();
          },
          error: (error) => {
            console.log(error);
            Loading.remove();
            Report.failure('Erreur', 'Une erreur est survenue lors de la sauvegarde', 'Okay');
          }
        });
      }
    );
  }

  headerColor: string = '#467aea';

  updateColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.headerColor = input.value;
    document.documentElement.style.setProperty('--header-color', this.headerColor);
  }


  private prepareFormData(): FormData {
    const formData = new FormData();
    const selectedModelId = this.currentModel; // 'bloc', 'compact', ou 'photo'
    const modelContent = document.getElementById(selectedModelId)?.innerHTML ?? '';

    // Fonction helper pour convertir les booléens en "0"/"1"
    const boolToString = (value: boolean): string => value ? "1" : "0";

    // Appeler la fonction qui met à jour le CSS avant l'envoi
    this.updateTemplateCss(); 

    // Ajout des champs basiques
    formData.append('typeDocument', this.typeDocument);
    formData.append('typeDesign', selectedModelId);
    formData.append('reprendre_model_vente', boolToString(this.isChecked));
    formData.append('contenu', modelContent);

    // Ajout des champs booléens avec conversion en "0"/"1"
    formData.append('signatureExpediteurModel', boolToString(this.showSignatureExpediteur));
    formData.append('mention_expediteur', this.mentionExpediteur);
    formData.append('signatureDestinataireModel', boolToString(this.showSignatureDestinataire));
    formData.append('mention_destinataire', this.mentionDestinataire);
    formData.append('autresImagesModel', boolToString(this.showAutresImages));
    formData.append('conditionsPaiementModel', boolToString(this.showConditionsPaiement));
    formData.append('conditionPaiement', this.conditionsPaiement);
    formData.append('coordonneesBancairesModel', boolToString(this.showCoordonneesBancaires));
    formData.append('titulaireCompte', this.titulaireCompte);
    formData.append('banque', this.banque);
    formData.append('compte', this.compte);
    formData.append('notePiedPageModel', boolToString(this.showNotePiedPage));
    formData.append('peidPage', this.notePiedPage);
    formData.append('css', this.templateCss);

    // Gestion des images
    if (this.imageSignatureExpediteur) {
      formData.append('image_expediteur', this.imageSignatureExpediteur);
    } else {
      formData.append('image_expediteur', '');
    }

    if (this.autreImage) {
      formData.append('image', this.autreImage);
    } else {
      formData.append('image', '');
    }

    // Debug des données envoyées
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return formData;
  }

  isLoading: boolean = true;
  listeModel: any[] = [];
  listeModelByTypeDocument() {
    this.configModel.getModelByTypeDocument(this.typeDocument).subscribe(
      (response) => {
        this.listeModel = response.modelesDocuments;
        console.log(this.listeModel);
        this.isLoading = false;

      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        console.log(this.isLoading)
      }
    )
  }

  currentModelSelected: any;
  contenuModel: any;
  // styleElement: any;
  chargerInfosModel(paramModel: any) {
    this.currentModelSelected = paramModel;
    console.log(paramModel);
    console.log(paramModel.image);
    console.log(paramModel.image_expediteur);
    this.currentModel = paramModel.typeDesign
    if (this.currentModel == 'bloc') {
      this.modelActif = 1;
    } else if (this.currentModel == 'compact') {
      this.modelActif = 2;
    } else if (this.currentModel == 'photo') {
      this.modelActif = 3;
    }
    this.contenuModel = paramModel.content;
    this.showSignatureExpediteur = paramModel.signatureDestinataireModel;
    this.mentionExpediteur = paramModel.mention_expediteur;
    this.imageSignatureExpediteur = paramModel.image_expediteur;
    this.showSignatureDestinataire = paramModel.signatureDestinataireModel;
    this.mentionDestinataire = paramModel.mention_destinataire;
    this.showAutresImages = paramModel.autresImagesModel;
    this.autreImage = paramModel.image;
    this.showConditionsPaiement = paramModel.conditionsPaiementModel;
    this.conditionsPaiement = paramModel.conditionPaiement;
    this.showCoordonneesBancaires = paramModel.coordonneesBancairesModel;
    this.compte = paramModel.compte;
    this.banque = paramModel.banque;
    this.titulaireCompte = paramModel.titulaireCompte;
    this.showNotePiedPage = paramModel.notePiedPageModel;
    this.notePiedPage = paramModel.peidPage;

    this.templateCss = paramModel.css;

    // Assure-toi que l'élément style existe
    if (!this.styleElement) {
      this.createStyleElement();
    }

    // Applique le CSS
    if (this.templateCss) {
      this.appliquerCSS(this.templateCss);
    }

    document.body.offsetHeight;
  }

  ngOnDestroy() {
    if (this.styleElement) {
      this.styleElement.remove();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private createStyleElement() {
    if (this.styleElement) {
      this.styleElement.remove();
    }
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'custom-model-styles';
    document.head.appendChild(this.styleElement);
  }

  private setupObserver() {
    // Observer pour détecter quand les éléments du tableau sont ajoutés
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.appliquerStylesTableau();
        }
      });
    });

    // Observer le document entier pour les changements dans le DOM
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  appliquerCSS(css: string) {
    try {
      if (!this.styleElement) {
        this.createStyleElement();
      }

      if (this.styleElement instanceof HTMLStyleElement) {
        // Applique les styles globaux
        this.styleElement.textContent = css;

        // Applique les styles spécifiques avec un délai
        setTimeout(() => {
          this.appliquerStylesTableau();
        }, 0);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du CSS:', error);
    }
  }

  private appliquerStylesTableau() {
    try {
      const headers = document.querySelectorAll('thead tr th');
      if (headers.length === 0) {
        // Si les en-têtes ne sont pas encore présents, réessayer plus tard
        setTimeout(() => this.appliquerStylesTableau(), 100);
        return;
      }

      headers.forEach(header => {
        if (header instanceof HTMLElement) {
          header.style.backgroundColor = 'var(--header-color)';
          header.style.color = 'white';
        }
      });

      // Force un reflow pour s'assurer que les styles sont appliqués
      document.body.offsetHeight;
    } catch (error) {
      console.error('Erreur lors de l\'application des styles du tableau:', error);
    }
  }

  // Dans votre méthode de mise à jour de couleur
  onColorChange(color: string) {
    document.documentElement.style.setProperty('--header-color', color);
    this.appliquerStylesTableau();
  }



  updateModel() {
    const formData = new FormData();
    // Fonction helper pour convertir les booléens en "0"/"1"
    const boolToString = (value: boolean): string => value ? "1" : "0";

    // Ajout des champs basiques
    formData.append('typeDocument', this.typeDocument);
    formData.append('typeDesign', this.currentModel);
    formData.append('reprendre_model_vente', boolToString(this.isChecked));
    formData.append('contenu', this.contenuModel);

    // Ajout des champs booléens avec conversion en "0"/"1"
    formData.append('signatureExpediteurModel', boolToString(this.showSignatureExpediteur));
    formData.append('mention_expediteur', this.mentionExpediteur);
    formData.append('signatureDestinataireModel', boolToString(this.showSignatureDestinataire));
    formData.append('mention_destinataire', this.mentionDestinataire);
    formData.append('autresImagesModel', boolToString(this.showAutresImages));
    formData.append('conditionsPaiementModel', boolToString(this.showConditionsPaiement));
    formData.append('conditionPaiement', this.conditionsPaiement);
    formData.append('coordonneesBancairesModel', boolToString(this.showCoordonneesBancaires));
    formData.append('titulaireCompte', this.titulaireCompte);
    formData.append('banque', this.banque);
    formData.append('compte', this.compte);
    formData.append('notePiedPageModel', boolToString(this.showNotePiedPage));
    formData.append('peidPage', this.notePiedPage);
    formData.append('css', this.templateCss);

    // Gestion des images
    if (this.currentModelSelected.image_expediteur) {
      formData.append('image_expediteur', this.imageSignatureExpediteur);
    } else {
      formData.append('image_expediteur', this.imageSignatureExpediteur);
    }

    if (this.currentModelSelected.image) {
      formData.append('image', this.currentModelSelected.image);
    } else {
      formData.append('image', this.autreImage);
    }

    // Debug des données envoyées
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous sauvegarder cette modele?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.configModel.updateModel(formData, this.currentModelSelected.id).subscribe(
          (reponse) => {
            console.log(reponse);
            Report.success('Notiflix Success', reponse.message, 'Okay',);
            this.listeModelByTypeDocument();
            Loading.remove()
          },
          (error) => {
            console.log(error)
          }
        )
      });
  }
}