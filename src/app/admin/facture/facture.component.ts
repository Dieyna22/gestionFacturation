import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CategorieService } from 'src/app/services/categorie.service';
import { PayementService } from 'src/app/services/payement.service';
import { GrilleTarifaireService } from 'src/app/services/grille-tarifaire.service';
import { VenteService } from 'src/app/services/vente.service';

interface Echeance {
  date: string;
  montant: number;
}

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent {

  dbUsers: any;
  tabClient: any[] = [];
  clientId: string = "";
  filterValue: string = "";
  tabCategorie: any[] = [];

  prenom: string = "";
nom: string = "";
mail: string = "";
typeClient: string = "";
entreprise: string = "";
adress: string = "";
telephone: string = "";

 


desc: string = "";
vente: string = "";
typeArticle: string = "";
achat: string = "";
quantite: string = "";
quantiteAlerte: string = "";
CategorieArticle:string="";
note:string="";
moyenPayement:string="";
typePaiement:string="";
tabGrille: any;
acompte:string="";
dateDebut:string="";
dateFin:string="";
totalAcompte:string="";
montantAcompte:string="";
commentaire:string="";

  constructor(private http: HttpClient, private ServiceCategorie: CategorieService,private articleService:ArticlesService, private clientService:ClientsService, private userService:UtilisateurService,private productService:ArticlesService,private renderer: Renderer2,private payementService:PayementService,private grilleservice:GrilleTarifaireService, private docService:VenteService) { 
    this.currentDate = this.getCurrentDate();
  }

  // Gestion bouton
boutonActif=1;

//model active
modelActif=1;

// Initialiser le contenu actuel
currentContent: string = 'factOne';

titre: string = 'Facture';
// Mettre à jour le contenu actuel
showComponant(contentId: string): void {
  this.currentContent = contentId; 
  this.titre=contentId;
}

currentModel : string = 'bloc'

// Mettre à jour le modèle actuel
showModel(modelId: string): void {
  this.currentModel = modelId; 
}

currentfactureType: string = 'tout'
showfactureType( typeID: string) {
  this.currentfactureType = typeID
}


  ngAfterViewInit() {
    this.updateTableHeaderColor();
  }

  ngOnInit(){
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
    
    this.listeClients();
    this.listeInfoSup();
    this.listeArticles();
    this.listeCategorie();
    this.listePayement();
    this.listeFacture();
  }

  color: string = '#467aea';

  onColorChange() {
    this.updateTableHeaderColor();
 
  }
  private updateTableHeaderColor() {
    const theadCells = document.querySelectorAll('thead tr th');
    theadCells.forEach((cell: any) => {
      this.renderer.setStyle(cell, 'background-color', this.color);
      this.renderer.setStyle(cell, 'color', 'white');
    });
  }


  ajouterUsers(){
    let clients={
      "nom_client":this.nom,
      "prenom_client":this.prenom,
      "nom_entreprise":this.entreprise,
      "adress_client":this.adress,
      "email_client":this.mail,
      "tel_client":this.telephone,
      "categorie_id":this.typeClient,
    }
    this.clientService.addClient(clients).subscribe(
      (client:any)=>{
       Report.success('Notiflix Success',client.message,'Okay',);
        this.vider();
        this.listeClients();
      },
      (err) => {
      }
    )
   }


   // méthode pour vider les champs
vider(){
  this.nom='';
  this.prenom='';
  this.mail='';
  this.typeClient='';
  this.entreprise='';
  this.adress='';
  this.telephone='';
 
 }

listeClients() {
  this.clientService.getAllClients().subscribe(
    (clients: any) => {
      this.tabClient = clients;
    },
    (err) => {
    }
  )
 }

 listeCategorie() {
  this.ServiceCategorie.getAllCategorie().subscribe(
    (categories: any) => {
      this.tabCategorie = categories.CategorieClient;
    },
    (err) => {
    }
  )
 }

 showChamps: boolean=false;

 afficherChamps(){
  this.showChamps=!this.showChamps;
 }

 ajouterArticle(){
  let articles={
    "nom_article":this.nom,
    "description":this.desc,
    "prix_unitaire":this.vente,
    "type_article":'produit',
    "prix_achat":this.achat,
    "quantite":this.quantite,
    "quantite_alert":this.quantiteAlerte,
    "id_categorie_article":this.CategorieArticle,
 
  }
  this.articleService.addArticle(articles).subscribe(
    (article:any)=>{
      Report.success('Notiflix Success',article.message,'Okay',);
      this.vider();
      this.listeArticles();
    },
    (err) => {
    }
  )
 }


 ajouterService(){
  let articles={
    "nom_article":this.nom,
    "description":this.desc,
    "prix_unitaire":this.vente,
    "type_article":'service',
    "prix_achat":this.achat,
    "quantite":this.quantite,
    "quantite_alert":this.quantiteAlerte,
    "id_categorie_article":this.CategorieArticle,
 
  }
  this.articleService.addArticle(articles).subscribe(
    (article:any)=>{
      Report.success('Notiflix Success',article.message,'Okay',);
      this.vider();
      this.listeArticles();
    },
    (err) => {
    }
  )
 }

 selectedClient: any;
 currentClient: any;

  onClientSelected() {
    this.currentClient = this.tabClient.filter((client : any) => client.id == this.selectedClient);
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
        this.InfoSup=infoSup.user;
      },
      (err) => {
      }
    )
  }

  tabPayement: any[] = [];
  listePayement() {
    this.payementService.getAllPayement().subscribe(
      (paye: any) => {
        this.tabPayement = paye;
      },
      (err) => {
      }
    )
   }



   listeGrille( row :any){
    this.grilleservice.getAllGrille(this.selectedClient,row.selectedProduct).subscribe(
      (grille:any)=>{
        this.tabGrille=grille.grilles_tarifaires[0].montant_tarif;
        row.grillePrice = this.tabGrille
      },
      (err) => {
      }
    )
  }


  priceByArticle:any;
  listePriceByArticle(row:any) {
    this.productService.getOtherPriceByArticle(row.selectedProduct).subscribe(
      (price: any) => {
        this.priceByArticle = price.autre_prix[0].montant;
        row.price =this.priceByArticle
      },
      (err) => {
      }
    )
   }

   totalHT: number=0;
   totalTVA: number=0;

  rows: any[] = [
    { selectedProduct: '', quantity: 0,  unitPrice: 0, reductionArticle: 0, tva:0,  total: 0, totalTTC:0 }
  ];

  addRow(): void {
    this.rows.push({ selectedProduct: '', quantity: 0, unitPrice: 0, reductionArticle: 0, tva:0,  total: 0, totalTTC:0 });
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
    this.calculateGrandTotal();
    this.calculateGrandTotalAvecRemise();
    this.calculateTVA();
    this.calculateGrandTotalTTC();
  }

  prixHt:any;
  calculateTotal(row: any): void {
    row.total = row.quantity * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixHt=row.total ;
    this.calculateGrandTotal();
    // this.calculateGrandTotalAvecRemise();
  }

  prixTTC:any;
  totalTTC:number=0;
  calculateTotalTva(row: any): void {
    row.totalTTC = row.quantity  * (1+row.tva/100 ) * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixTTC=row.totalTTC;
    // this.calculateGrandTotalAvecRemise();
    this.calculateGrandTotalTTC();
    this.calculateTVA();
  }



  
  total: number = 0;

  calculateGrandTotal(): void {
    this.total = this.rows.reduce((sum, row) => sum + row.total, 0);
  }

  calculateTVA(): void {
    this.totalTVA = this.rows.reduce((sum, row) => sum + (row.tva/100)*row.quantity*(row.promotionalPrice || row.grillePrice || row.price || row.unitPrice), 0);
  }

  calculateGrandTotalTTC(): void {
    this.totalTTC = this.rows.reduce((sum, row) => sum + row.totalTTC, 0);
    this.calculateGrandTotalAvecRemise();
  }


  remise: number = 0;
  totalRemise:any;
  calculateGrandTotalAvecRemise(): number {
    this.totalRemise = this.totalTTC - this.remise;
    return this.totalRemise;
    // this.totalRemise = this.rows.reduce((sum, row) => sum + row.totalTTC - this.remise, 0) ;
  }

  products:any;
  listeArticles() {
    this.productService.getAllArticles().subscribe(
      (article: any) => {
        this.products = article;
      },
      (err) => {
      }
    )
   }
   
   productSelected:any;
   currentProduct: any;
  onProductSelect(row: any): void {
    this.currentProduct = this.products.filter((product : any) => product.id == row.selectedProduct);
    console.log(this.currentProduct);
    row.unitPrice = this.currentProduct[0].prix_unitaire;
    row.promotionalPrice = this.currentProduct[0].prix_promo;
    this.productSelected=this.currentProduct[0].nom_article;
  }



  noteFacture:string="";
  createFacture(){
    let facture = 
    {
      "client_id": this.selectedClient,
      "note_fact": this.noteFacture,
      "reduction_facture": this.remise,
      "type_paiement": this.typePaiement,
      "id_paiement": this.moyenPayement,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "echeances":[] as Array<{
        date_pay_echeance: string,
        montant_echeance: number,
      }>,
      "facture_accompts": [
        {
          titreAccomp: this.acompte,
          dateAccompt: this.dateDebut,
          dateEcheance: this.dateFin,
          montant: this.montantAcompte,
          commentaire: this.commentaire
        }
      ]
    },

    factureEcheance = 
    {
      "client_id": this.selectedClient,
      "note_fact": this.noteFacture,
      "reduction_facture": this.remise,
      "type_paiement": this.typePaiement,
      "id_paiement": this.moyenPayement,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "echeances":[] as Array<{
        date_pay_echeance: string,
        montant_echeance: number,
      }>,
    },

    factureAcompte = 
    {
      "client_id": this.selectedClient,
      "note_fact": this.noteFacture,
      "reduction_facture": this.remise,
      "type_paiement": this.typePaiement,
      "id_paiement": this.moyenPayement,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "facture_accompts": [
        {
          titreAccomp: this.acompte,
          dateAccompt: this.dateDebut,
          dateEcheance: this.dateFin,
          montant: this.montantAcompte,
          commentaire: this.commentaire
        }
      ]
    }
    
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      facture.articles.push({
        "id_article": row.selectedProduct ,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      factureEcheance.articles.push({
        "id_article": row.selectedProduct ,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      factureAcompte.articles.push({
        "id_article": row.selectedProduct ,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    // Ajouter des échéances à la facture
    for (let i = 0; i < this.input.length; i++) {
      const item = this.input[i];
      alert(item.date)
      alert(item.prix)
      factureEcheance.echeances.push({
        date_pay_echeance: item.date,
        montant_echeance: item.prix,
        // statut_paiement:"nonpayer",
      });
    }

    // Envoyer la facture au service de facturation
    if(this.typePaiement=='immediat'){
      this.docService.createFacture(facture).subscribe(
        (facture)=>{
          // console.log(facture.message);
          Report.success('Notiflix Success',facture.message,'Okay',);
          this.viderchamps();
        },
        (err)=>{
          console.log(err);
        }
      )
    } else if (this.typePaiement=='echeance'){
      this.docService.createFacture(factureEcheance).subscribe(
        (facture)=>{
          // console.log(facture.message);
          Report.success('Notiflix Success',facture.message,'Okay',);
          this.viderchamps();
        },
        (err)=>{
          console.log(err);
        }
      )
    }  if (this.typePaiement=='facture_Accompt'){
      this.docService.createFacture(factureAcompte).subscribe(
        (facture)=>{
          // console.log(facture.message);
          Report.success('Notiflix Success',facture.message,'Okay',);
          this.viderchamps();
        },
        (err)=>{
          console.log(err);
        }
      )}
   
  }

  tabFactures:any[] =[];
  tabFactureFilter:any[] =[];
  listeFacture(){
    this.docService.getAllFacture().subscribe(
      (factures) => {
        this.tabFactures = factures.factures;
        this.tabFactureFilter = this.tabFactures;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesEcheance:any[]=[]
  listeFactureEcheance(){
    this.docService.getAllFactureEcheance().subscribe(
      (factures) => {
        this.tabFacturesEcheance = factures.factures_echeance;
        this.tabFactureFilter =this.tabFacturesEcheance;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesAcompte:any[]=[]
  listeFactureAcompte(){
    this.docService.getAllFactureAcompte().subscribe(
      (factures) => {
        this.tabFacturesAcompte = factures.factures_accompt;
        this.tabFactureFilter = this.tabFacturesAcompte;
        console.log(this.tabFacturesAcompte);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  isPreview: boolean = false;

  togglePreviewMode() {
    this.isPreview = !this.isPreview;
  }


  generatePdf() {
    // Récupérer le contenu du div "print-section"
    const printSection = document.getElementById('print-section');
    if (printSection) {
      // Capturer une image du contenu du div "print-section"
      html2canvas(printSection).then(canvas => {
        // Créer un nouveau document PDF
        const pdf = new jsPDF();
  
        // Ajouter l'image du contenu au PDF
        const imgData = canvas.toDataURL('image/png');
        // Avec 8 arguments
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'myImage', 'FAST');
        
        // Enregistrer le PDF
        pdf.save('facture.pdf');
      });
    } else {
      // Gérer le cas où printSection est null
      console.error('printSection est null');
    }
  }

  // Variables si les champs sont exacts
exactClient: boolean = false;
exactData: boolean = false;

// validation des formulaires
// client
verifClientFonction() {
  this.exactClient = false;
  if (this.selectedClient == "") {
    
  }
 else {
    this.exactClient = true;
  }
}

// produit
verifProduitFonction(row:any) {
  this.exactData = false;
  if (row.quantity == "" && row.selectedProduct == "" && row.reductionArticle) {
    
  }
 else {
    this.exactData = true;
  }
}

  // Initialiser le contenu actuel
  currentStep: string = 'client';

  // Mettre à jour le contenu actuel
  showStep(contentId: string): void {
    this.currentStep = contentId;
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
  viderchamps(){
    this.input = [
      { date: '', prix: 0 }
    ];
    this.rows = [];
    this.acompte = "";
    this.dateDebut = "";
    this.dateFin = "";
    this.montantAcompte = "";
    this.commentaire = "";
    this.totalHT = 0;
    this.totalTTC = 0;
    this.typePaiement = "";
  }

  // Attribut pour la pagination
itemsParPage = 3; // Nombre d'articles par page
pageActuelle = 1; // Page actuelle

 // Pagination 
// Méthode pour déterminer les articles à afficher sur la page actuelle
getItemsPage(): any[] {
 const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
 const indexFin = indexDebut + this.itemsParPage;
 return this.tabFactureFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
}
}
