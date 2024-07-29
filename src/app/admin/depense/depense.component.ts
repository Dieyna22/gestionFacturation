import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VenteService } from 'src/app/services/vente.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.css']
})
export class DepenseComponent {
  selectedPrefix: string = '';
  customPrefix: string = '';
  nextNumber: string = '00000';
  baseNumber: string = '00000';
  prefix: string = '';
  updateNum: string ='';
  numerotation : string ='';
  typeFournisseur : string='particulier';
  prenom : string='';
  nom : string='';
  codepostal : string='';
  email : string='';
  adresse : string='';
  ville : string='';
  tel : string='';
  pays : string=''; 
  note : string='';
  nomEntreprise  : string='';
  codeFiscal  : string='';
  tabFournisseur:any[]=[];
  tabFournisseurFilter:any[]=[];


  constructor(private http: HttpClient,private docService:VenteService) { 
  }

boutonActif=1;
currentDoc : string = 'fournisseur'
showTypeDocument(docId:string):void{
 this.currentDoc=docId
}

showChamps: boolean=false;

afficherChamps(){
 this.showChamps=!this.showChamps;
}
// Initialiser le contenu actuel
currentContent: string = 'particulier';
zoneActif=1;
// Mettre à jour le contenu actuel
showComponant(contentId: string): void {
  this.currentContent = contentId; 
}

setTypeFournisseur(type: string) {
  this.typeFournisseur = type;
}

currentNumConfig : string = 'sansPrefixes';
showNumConfig(configId: string) {
  this.currentNumConfig = configId
}

ngOnInit(){
  this.listeNumber();
  this.listeFournisseur();
}

updatePrefix() {
  const now = new Date();
  let datePart = '';

  switch (this.selectedPrefix) {
    case 'custom':
      this.prefix = this.customPrefix;
      break;
    case 'annee':
      datePart = now.getFullYear().toString();
      break;
    case 'annee_mois':
      datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      break;
    case 'annee_mois_jour':
      datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
      break;
  }

  if (this.selectedPrefix !== 'custom') {
    this.prefix = this.customPrefix + datePart;
  }

  this.nextNumber = this.prefix + this.baseNumber +1;
}

configurationNumero(){
  let numFacture =
  {
    type_document:'fournisseur',
    type_numerotation:this.numerotation,
    prefixe:this.customPrefix,
    format:this.selectedPrefix,
  }

  this.docService.configNumero(numFacture).subscribe(
    (response) => {
      console.log('Configuration numero : ', response);
    },
    (error) => {
      console.error('Erreur lors de la configuration du numérotation : ', error);
    }
  )
}

formatFinal:any
tabNum:any[]=[];
numComplet:any
listeNumber() {
  const now = new Date();
  this.docService.getAllNumeroFournisseur().subscribe(
    (response) => {
      if (response.configuration && response.configuration.length > 0) {
        this.tabNum = response.configuration;
        console.log('Liste des numéros : ', response);

        const config = this.tabNum[0];
        let prefixe = String(config.prefixe).toLowerCase();
        let format = config.format;
        let compteur = parseInt(config.compteur) || 0;

        console.log('Prefixe:', prefixe);
        console.log('Format:', format);
        console.log('Compteur:', compteur);

        // Génère la partie date du numéro
        let datePart = '';
        switch (format) {
          case 'annee':
            datePart = now.getFullYear().toString();
            break;
          case 'annee_mois':
            datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
            break;
          case 'annee_mois_jour':
            datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
            break;
          default:
            datePart = now.getFullYear().toString();
        }

        // Incrémente le compteur
        compteur++;

        // Formate le numéro complet
        this.numComplet = `${prefixe}${datePart}${compteur.toString().padStart(6, '0')}`;
        
        // Le prochain numéro est identique au numéro complet
        this.nextNumber = this.numComplet;

        console.log('Numéro complet : ', this.numComplet);
        console.log('Prochain numéro : ', this.nextNumber);
      } else {
        console.error('Pas de configuration trouvée dans la réponse');
      }
    },
    (error) => {
      console.error('Erreur lors de la récupération des numéros : ', error);
    }
  );
}

addFournisseur(){
  let fournisseur=
  {
    type_fournisseur:this.typeFournisseur,
    prenom_fournisseur:this.prenom,
    nom_fournisseur:this.nom,
    code_postal_fournisseur:this.codepostal,
    email_fournisseur:this.email,
    adress_fournisseur:this.adresse,
    ville_fournisseur:this.ville,
    tel_fournisseur:this.tel,
    pays_fournisseur:this.pays, 
    noteInterne_fournisseur:this.note,
    nom_entreprise:this.nomEntreprise,
    num_id_fiscal:this.codeFiscal,
  }

  this.docService.createFournisseur(fournisseur).subscribe(
    (response)=>{
      console.log(response);
      this.listeFournisseur();
      this.vider();
      Report.success('Notiflix Success',response.message,'Okay',);
    },
    (err)=>{
      console.log(err);
    }
  )
}


listeFournisseur(){
  this.docService.getAllFournisseur().subscribe(
    (response) => {
      this.tabFournisseur = response;
      this.tabFournisseurFilter = this.tabFournisseur; // Copie du tableau pour filtrer les données
      console.log('Liste des fournisseurs : ', response);
    },
    (error) => {
      console.error('Erreur lors de la récupération des fournisseurs : ', error);
    }
  );
}

supprimerFournisseur(idFournisseur :any){
  console.log(idFournisseur);
  Confirm.init({
    okButtonBackground: '#FF1700',
    titleColor: '#FF1700'
  });
  Confirm.show('Confirmation',
  'Voullez-vous supprimer ce fournisseur?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.docService.deleteFournisseur(idFournisseur).subscribe(
        (response)=>{
          Notify.success(response.message);
          this.listeFournisseur();
          Loading.remove()
        }
      )
    });
}

numFournisseur:any
currentFournisseur:any;
chargerInfoFournisseur(paramFournisseur:any){
  this.currentFournisseur = paramFournisseur;
  this.numFournisseur = paramFournisseur.num_fournisseur;
  this.prenom = paramFournisseur.prenom_fournisseur;
  this.nom = paramFournisseur.nom_fournisseur;
  this.adresse = paramFournisseur.adress_fournisseur;
  this.ville = paramFournisseur.ville_fournisseur;
  this.codepostal = paramFournisseur.code_postal_fournisseur;
  this.email = paramFournisseur.email_fournisseur;
  this.tel = paramFournisseur.tel_fournisseur;
  this.pays = paramFournisseur.pays_fournisseur;
  this.note = paramFournisseur.noteInterne_fournisseur;
  this.nomEntreprise = paramFournisseur.nom_entreprise;
  this.codeFiscal = paramFournisseur.num_id_fiscal; 
}


updateFournisseur(){
  let fournisseur=
  {
    type_fournisseur:this.typeFournisseur,
    prenom_fournisseur:this.prenom,
    nom_fournisseur:this.nom,
    code_postal_fournisseur:this.codepostal,
    email_fournisseur:this.email,
    adress_fournisseur:this.adresse,
    ville_fournisseur:this.ville,
    tel_fournisseur:this.tel,
    pays_fournisseur:this.pays, 
    noteInterne_fournisseur:this.note,
    nom_entreprise:this.nomEntreprise,
    num_id_fiscal:this.codeFiscal,
  }
  this.docService.updateFournisseur(this.currentFournisseur.id ,fournisseur).subscribe(
    (response)=>{
      console.log(response);
      this.listeFournisseur();
      this.vider();
      Report.success('Notiflix Success',response.message,'Okay',);
    },
    (err)=>{
      console.log(err);
    }
  )
}

vider(){
  this.typeFournisseur = '';
  this.prenom = '';
  this.nom = '';
  this.adresse = '';
  this.ville = '';
  this.codepostal = '';
  this.email = '';
  this.tel = '';
  this.pays = '';
  this.note = '';
  this.nomEntreprise = '';
  this.codeFiscal = '';
  this.currentFournisseur = null;
  this.numFournisseur = null;
}

input: any[] = [
  { date: '', prix: 0 }
];

addInput(): void {
  this.input.push({ date: '', prix: 0});
}

deleteInput(index: number): void {
  this.input.splice(index, 1);
}


  // Attribut pour la pagination
  itemsParPage = 3; // Nombre d'articles par page
  pageActuelle = 1; // Page actuelle
  
   // Pagination 
  // Méthode pour déterminer les articles à afficher sur la page actuelle
  getItemsPage(): any[] {
    const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
    const indexFin = indexDebut + this.itemsParPage;
    return this.tabFournisseurFilter.slice(indexDebut, indexFin);
   }
   
   // Méthode pour générer la liste des pages
   get pages(): number[] {
    const totalPages = Math.ceil(this.tabFournisseurFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
   }
   
   // Méthode pour obtenir le nombre total de pages
   get totalPages(): number {
    return Math.ceil(this.tabFournisseurFilter.length / this.itemsParPage);
   }
}
