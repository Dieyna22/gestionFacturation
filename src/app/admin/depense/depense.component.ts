import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VenteService } from 'src/app/services/vente.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { PayementService } from 'src/app/services/payement.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.css']
})
export class DepenseComponent {
  selectedPrefix: string = '';
  customPrefix: string = '';
  nextNumber: string = '00000';
  nextNumberDepense: string = '00000';
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
  tabDepense:any[]=[];

  categorie:string='';
  periode:string='';
  durePeriode:string='';
  date:string='';
  montantEcheance:string='';
  datePay:string='';
  numero:string='';
  dateFacture:string='';
  active:boolean=false;
  impayer:string='impayer';
  moyenPayement:string="";
  depensePay:boolean=false;
  Duree:boolean=false;
  tva: number = 0;
  montantPay: number = 0;
  montantPayTtc: number = 0;


  constructor(private http: HttpClient,private payementService:PayementService,private docService:VenteService,private datePipe: DatePipe) { 
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

setTypeActive(type: boolean) {
  this.active = type;
}

setTypeImpay(type: string) {
  this.impayer = type;
}

setTypedepensePay(type: boolean) {
  this.depensePay = type;
}

setTypeDuree(type: boolean) {
  this.Duree = type;
}

currentNumConfig : string = 'sansPrefixes';
showNumConfig(configId: string) {
  this.currentNumConfig = configId
}

showTva: boolean =false;
showInputTva(){
  this.showTva=!this.showTva;
}

ngOnInit(){
  this.listeNumber();
  this.listeNumberDepense();
  this.listeFournisseur();
  this.listeCategorieDepense();
  this.listePayement();
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
  this.nextNumberDepense = this.prefix + this.baseNumber +1;
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
configurationNumeroDepense(){
  let numFacture =
  {
    type_document:'depense',
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

listeNumberDepense() {
  const now = new Date();
  this.docService.getAllNumeroDepense().subscribe(
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
        this.nextNumberDepense = this.numComplet;

        console.log('Numéro complet : ', this.numComplet);
        console.log('Prochain numéro : ', this.nextNumberDepense);
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

  this.input = [
    { date: '', prix: 0 }
  ];


  this.categorie='';
  this.periode='';
  this.durePeriode='';
  this.date='';
  this.montantEcheance='';
  this.datePay='';
  this.montantPay=0;
  this.tva=0;
  this.numero='';
  this.dateFacture='';
  this.active=false;
  this.impayer='impayer';
  this.moyenPayement="";
  this.montantPayTtc=0;
  this.depensePay=false;
  this.Duree=false;
  

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

infosPayement:boolean = false;
showInfosPayement(){
  this.infosPayement =!this.infosPayement;
}

echeancePay:boolean = false;
showEcheancePay(){
  this.echeancePay =!this.echeancePay;
}

infosFacture:boolean = false;
showInfosFacture(){
  this.infosFacture =!this.infosFacture;
}


addCategorieDepense(){
  let categorieDepense=
  {
    nom_categorie_depense:this.categorie,
  }
  this.docService.createCategorieDepense(categorieDepense).subscribe(
    (response)=>{
      console.log(response);
      this.listeCategorieDepense();
      Report.success('Notiflix Success',response.message,'Okay',);
    },
    (err)=>{
      console.log(err);
    }
  )
}

tabCategorie:any[]=[];
listeCategorieDepense(){
  this.docService.getAllCategorieDepense().subscribe(
    (response) => {
      this.tabCategorie = response.CategorieDepense;
      console.log('Liste des catégories de dépenses : ', response);
    },
    (error) => {
      console.error('Erreur lors de la récupération des catégories de dépenses : ', error);
    }
  );
}

tabPayement: any[] = [];
listePayement() {
  this.payementService.getAllPayement().subscribe(
    (paye: any) => {
      this.tabPayement = paye;
      console.log(this.tabPayement);
    },
    (err) => {
    }
  )
 }

createDepense(){
  let depense=
  {
    "activation": this.active,
    "id_categorie_depense": this.categorie,
    "date_paiement": this.datePay,
    "commentaire": this.note,
    "tva_depense": this.tva,
    "montant_depense_ht": this.montantPay,
    "montant_depense_ttc": this.montantPayTtc,
    "num_facture": this.numero,
    "date_facture": this.dateFacture,
    "fournisseur_id": null,
    "statut_depense": this.impayer,
    "id_paiement": this.moyenPayement,
    "doc_externe": null,
    "plusieurs_paiement": this.depensePay,
    "duree_indeterminee": this.Duree,
    "periode_echeance":this.durePeriode,
    "nombre_periode":this.periode,
    "echeances":[] as Array<{
      date_pay_echeance: string,
      montant_echeance: number,
    }>,
  }
   // Ajouter des échéances à la facture
   for (let i = 0; i < this.input.length; i++) {
    const item = this.input[i];
    depense.echeances.push({
      date_pay_echeance: item.date,
      montant_echeance: item.prix,
    });
  }
 this.docService.createDepense(depense).subscribe(
   (response)=>{
     console.log(response);
     this.vider();
     Report.success('Notiflix Success',response.message,'Okay',);
   },
   (err)=>{
     console.log(err);
   }
 )
}

listeDepense(){
  this.docService.getAllDepense().subscribe(
    (response) => {
      this.tabDepense = response.depenses;
      console.log('Liste des dépenses : ',  this.tabDepense);
      this.tabFournisseurFilter = this.tabDepense; // Création d'une copie pour la recherche
    },
    (error) => {
      console.error('Erreur lors de la récupération des dépenses : ', error);
    }
  );
}

supprimerDepense(idDepense :any){
  console.log(idDepense);
  Confirm.init({
    okButtonBackground: '#FF1700',
    titleColor: '#FF1700'
  });
  Confirm.show('Confirmation',
  'Voullez-vous supprimer cette dépense?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.docService.deleteDepense(idDepense).subscribe(
        (response)=>{
          Notify.success(response.message);
          this.listeDepense();
          Loading.remove()
        }
      )
    });
}


numDepense:any
currentDepense:any;
chargerInfoDepense(paramDepense:any){
  this.currentDepense = paramDepense;
  this.numDepense = paramDepense.num_depense;
  console.log(paramDepense)

  this.categorie = paramDepense.categorie_depense_id;
  this.note = paramDepense.commentaire;
  this.active = paramDepense.activation;
  this.tva = paramDepense.tva_depense;
  this.montantPay = paramDepense.montant_depense_ht;
  this.montantPayTtc = paramDepense.montant_depense_ttc;
  this.numero = paramDepense.num_facture;
  this.dateFacture = paramDepense.date_facture;
  this.impayer = paramDepense.statut_depense;
  this.moyenPayement = paramDepense.id_paiement;
  this.Duree = paramDepense.duree_indeterminee;
  this.periode = paramDepense.nombre_periode;
  this.durePeriode = paramDepense.periode_echeance;
  this.datePay = paramDepense.date_paiement;
}

updateDepense(){
  let depense=
  {
    "activation": this.active,
    "id_categorie_depense": this.categorie,
    "date_paiement": this.datePay,
    "commentaire": this.note,
    "tva_depense": this.tva,
    "montant_depense_ht": this.montantPay,
    "montant_depense_ttc": this.montantPayTtc,
    "num_facture": this.numero,
    "date_facture": this.dateFacture,
    "fournisseur_id": null,
    "statut_depense": this.impayer,
    "id_paiement": this.moyenPayement,
    "doc_externe": null,
  }
  this.docService.updateDepense(this.currentDepense.id,depense).subscribe(
    (response) => {
      console.log(response);
      this.vider();
      this.listeDepense();
      this.showInputTva();
      Report.success('Notiflix Success',response.message,'Okay',);
    },
    (error) => {
      console.error('Erreur lors de la mise à jour de la dépense : ', error);
    }
  )
}

calculerMontantTtc() {
  if (this.tva !== null && this.montantPay !== null) {
    const tauxTVA = 1 + (this.tva / 100);
    this.montantPayTtc = this.montantPay * tauxTVA;
    // Arrondir à deux décimales
    this.montantPayTtc = Math.round(this.montantPayTtc * 100) / 100;
  } else {
    this.montantPayTtc = 0;
  }
}

calculerProchaineDateDepense(datePaiement: string, periodeEcheance: string): string {
  const date = new Date(datePaiement);
  
  switch (periodeEcheance) {
    case 'jour':
      date.setDate(date.getDate() + 1);
      break;
    case 'semaine':
      date.setDate(date.getDate() + 7);
      break;
    case 'mois':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return 'Période d\'échéance invalide';
  }
  
  return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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
