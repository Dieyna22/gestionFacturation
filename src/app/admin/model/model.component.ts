import { Component, Renderer2 } from '@angular/core';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent {
  isChecked: boolean = false;
  titre: string = 'Facture';

  // Gestion bouton
  boutonActif = 1;

  //model active
  modelActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = 'facture';

  ngOnInit(): void {
    this.listeInfoSup();
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
  color: string = '#467aea';

  onColorChange() {
    this.updateTableHeaderColor();

  }
  private updateTableHeaderColor() {
    const theadCells = document.querySelectorAll('thead tr th');
    const titreZone = document.querySelector('h1')
    theadCells.forEach((cell: any) => {
      this.renderer.setStyle(cell, 'background-color', this.color);
      this.renderer.setStyle(cell, 'color', 'white')
    });
  }

  constructor(private renderer: Renderer2, private userService: UtilisateurService) {
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
  showSignatureExpediteur = false;
  showSignatureDestinataire = false;
  showAutresImages = false;
  showConditionsPaiement = false;
  showCoordonneesBancaires = false;
  showNotePiedPage = false;

  mentionExpediteur = '';
  mentionDestinataire = '';
  conditionsPaiement = '';
  titulaireCompte = '';
  banque = '';
  compte = '';
  notePiedPage = '';

  toggleSection(section: string, value: boolean) {
    switch (section) {
      case 'showSignatureExpediteur':
        this.showSignatureExpediteur = value;
        console.log('Signature expéditeur', value ? 'activée' : 'désactivée');
        // Actions supplémentaires pour la signature expéditeur
        break;
      case 'showSignatureDestinataire':
        this.showSignatureDestinataire = value;
        console.log('Signature destinataire', value ? 'activée' : 'désactivée');
        // Actions supplémentaires pour la signature destinataire
        break;
      case 'showAutresImages':
        this.showAutresImages = value;
        console.log('Autres images', value ? 'activées' : 'désactivées');
        // Actions supplémentaires pour les autres images
        break;
      case 'showConditionsPaiement':
        this.showConditionsPaiement = value;
        console.log('Conditions de paiement', value ? 'activées' : 'désactivées');
        // Actions supplémentaires pour les conditions de paiement
        break;
      case 'showCoordonneesBancaires':
        this.showCoordonneesBancaires = value;
        console.log('Coordonnées bancaires', value ? 'activées' : 'désactivées');
        // Actions supplémentaires pour les coordonnées bancaires
        break;
      case 'showNotePiedPage':
        this.showNotePiedPage = value;
        console.log('Note pied de page', value ? 'activée' : 'désactivée');
        // Actions supplémentaires pour la note de pied de page
        break;
      default:
        console.warn('Section inconnue:', section);
    }
  }

  ajouterSignature(type: 'expediteur' | 'destinataire') {
    console.log(`Ajouter signature ${type}`);
    // Ici, vous pouvez implémenter la logique pour ajouter une signature
  }

  ajouterImage() {
    console.log('Ajouter image');
    // Ici, vous pouvez implémenter la logique pour ajouter une image
  }

  signatureExpediteur:boolean=false
  afficherSignatureExpediteur(){
    this.signatureExpediteur = !this.signatureExpediteur;
  }

  signatureDestinataire:boolean=false
  afficherSignatureDestinataire(){
    this.signatureDestinataire = !this.signatureDestinataire;
  }

}
