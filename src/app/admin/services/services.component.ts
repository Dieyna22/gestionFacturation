import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { PromoService } from 'src/app/services/promo.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CategorieArticleService } from 'src/app/services/categorie-article.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {

  // Déclaration des variables 
tabArticle: any[] = [];
tabArticleFilter: any[] = [];
tabPromo: any[] = [];
tabCategorie: any[] = [];
dbUsers: any;
role: string = ''

filterValue: string = "";
nom: string = "";
desc: string = "";
vente: string = "";
typeArticle: string = "";
achat: string = "";
quantite: string = "";
quantiteAlerte: string = "";
CategorieArticle:string="";
note:string="";
unite:string="";
tva:string="";
titrePrix:string="";
tvaPrix:string="";
prixVente:string="";



inputnom: string = "";
inputdesc: string = "";
inputvente: string = "";
inputachat: string = "";
inputquantite: string = "";
inputquantiteAlerte: string = "";
inputtypeArticle: string = "";
inputpromo: string = "";
inputCategorieArticle:string="";
inputtva: string = "";
inputunite: string = "";
inputtitrePrix: string = "";
inputtvaPrix: string = "";
inputprixVente: string = "";

isSuperAdmin: boolean = false;
isAdmin: boolean = false;
isUser: boolean = false;


constructor(private http: HttpClient, private articleService:ArticlesService,private promoService:PromoService,private Categorie: CategorieArticleService) { }



ngOnInit(): void {
 this.listeArticles();
 this.listePromos();
 this.listeCategorie();

 this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
 this.role = this.dbUsers.user.role

 if (this.role == "super_admin") {
   this.isSuperAdmin = true;
   this.isAdmin = false;
   this.isUser = false;
 } else if (this.role == "administrateur") {
   this.isSuperAdmin = false;
   this.isAdmin = true;
   this.isUser = false;
 }else if (this.role == "utilisateur_simple") {
   this.isSuperAdmin = false;
   this.isAdmin = false;
   this.isUser = true;
 }
}


// Gestion bouton
boutonActif=1;

// Initialiser le contenu actuel
currentContent: string = 'categorie';

// Mettre à jour le contenu actuel
showComponant(contentId: string): void {
  this.currentContent = contentId; 
}

menu: string = 'information';
Actif=1;
// Mettre à jour le contenu actuel
showMenu(menuId: string): void {
  this.menu = menuId;
}

ajouterArticle(){
 let articles={
  "nom_article": this.nom,
  "description": this.desc,
  "prix_achat":this.achat,
  "prix_unitaire": this.vente,
  "tva": this.tva,
  "type_article": "service",
  "unité": this.unite,
  "id_categorie_article":this.CategorieArticle,
  "autres_prix": [
    {
      "titrePrix": this.titrePrix,
      "montant": this.prixVente,
      "tva": this.tvaPrix
    }
  ],

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

listeArticles() {
 this.articleService.getAllArticles().subscribe(
   (article: any) => {
     this.tabArticle = article;
     this.tabArticleFilter = this.tabArticle.filter((article: any) => article.type_article == 'service');
   },
   (err) => {
   }
 )
}

// méthode pour vider les champs
vider(){
 this.nom='';
 this.desc='';
 this.vente='';
 this.typeArticle='';
 this.achat='';
 this.quantite='';
 this.quantiteAlerte='';
 this.CategorieArticle='';
 this.note='';
 this.unite='';
 this.tva='';
 this.prixVente='';
 this.titrePrix='';
 this.tvaPrix='';

 this.inputnom='';
 this.inputdesc='';
 this.inputvente='';
 this.inputtypeArticle='';
 this.inputachat='';
 this.inputquantite='';
 this.inputquantiteAlerte='';
 this.inputCategorieArticle='';
 this.inputtva='';
 this.inputunite='';
 this.inputtitrePrix='';
 this.inputtvaPrix='';
 this.inputprixVente='';
 
 

}

deleteAricle(paramArticle:any){
  Confirm.init({
    okButtonBackground: '#FF1700',
    titleColor: '#FF1700'
  });
  Confirm.show('Confirmer Suppression ',
  'Voullez-vous supprimer?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.articleService.deleteArticle(paramArticle).subscribe(
        (response)=>{
          Notify.success(response.message);
          this.listeArticles();
          Loading.remove()
        }
      )
    });
 
}

currentArticle: any;
numArticles: any;
// Methode pour charger les infos de l'article  à modifier
chargerInfosArticle(paramArticle:any){
 this.currentArticle = paramArticle;
 this.inputnom = paramArticle.nom_article;
 this.inputdesc = paramArticle.description;
 this.inputvente = paramArticle.prix_unitaire;
 this.inputtypeArticle = paramArticle.type_article;
 this.inputachat=paramArticle.prix_achat;
 this.inputquantite=paramArticle.quantite;
 this.inputquantiteAlerte=paramArticle.quantite_alert;
 this.inputCategorieArticle=paramArticle.id_categorie_article;
 this.inputtva=paramArticle.tva;
 this.inputunite=paramArticle.unité;
//  this.inputtitrePrix=paramArticle.autres_prix[0].titrePrix;
//  this.inputtvaPrix=paramArticle.autres_prix[0].tva;
//  this.inputprixVente=paramArticle.autres_prix[0].montant;
 this.numArticles=paramArticle.num_article;
}

updateArticle() {
  let articles={
    "num_article":this.numArticles,
    "nom_article":this.inputnom,
    "description":this.inputdesc,
    "prix_unitaire":this.inputvente,
    "type_article":this.currentArticle.type_article,
    "prix_achat":this.inputachat,
    "id_categorie_article":this.inputCategorieArticle,
    "unité":this.inputunite,
    "tva":this.inputtva,
    "autres_prix": [
      {
        "titrePrix": this.inputtitrePrix,
        "montant": this.inputprixVente,
        "tva": this.inputtvaPrix
      }
    ],

  }
  Confirm.init({
    okButtonBackground: '#5C6FFF',
    titleColor: '#5C6FFF'
  });
  Confirm.show('Confirmer modification ',
  'Voullez-vous modifier?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.articleService.updateArticle(this.currentArticle.id,articles).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listeArticles();
          this.vider();
          Loading.remove();
        }
      );
    });
} 



listePromos() {
  this.promoService.getAllPromo().subscribe(
    (promos: any) => {
      this.tabPromo = promos.promos;
    },
    (err) => {
    }
  )
 }

 idArticle:any;
 recupIdArticle(paramArticle:any){
  this.idArticle=paramArticle;
 }

 affecterPromo(){
  let promo={
    "promo_id":this.inputpromo,
  }
  Confirm.init({
    okButtonBackground: '#5C6FFF',
    titleColor: '#5C6FFF'
  });
  Confirm.show('Confirmation ',
  'Voullez-vous vous affecter une promotion?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.articleService.affecterArticle(this.idArticle,promo).subscribe(
        (response) => {
          Notify.success(response.message);
          Loading.remove();
        },
        (err) => {
        }
      )
    });
  
 }


 listeCategorie() {
  this.Categorie.getAllCategorieService().subscribe(
    (categories: any) => {
      this.tabCategorie = categories.CategorieArticle;
      console.log(this.tabCategorie)
    },
    (err) => {
    }
  )
 }



// Methode de recherche automatique pour un utilisateur
onSearch() {
 // Recherche se fait selon le nom ou le prenom 
 this.tabArticleFilter = this.tabArticle.filter(
   (elt: any) => (elt?.nom_article.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.nom_categorie.toLowerCase().includes(this.filterValue.toLowerCase()))
 );
}
// Attribut pour la pagination
itemsParPage = 3; // Nombre d'articles par page
pageActuelle = 1; // Page actuelle

 // Pagination 
// Méthode pour déterminer les articles à afficher sur la page actuelle
getItemsPage(): any[] {
 const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
 const indexFin = indexDebut + this.itemsParPage;
 return this.tabArticleFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabArticleFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabArticleFilter.length / this.itemsParPage);
}

 showChamps: boolean=false;

 afficherChamps(){
  this.showChamps=!this.showChamps;
 }

 formPrix: boolean=false;
 afficherChampsPrix(){
   this.formPrix=!this.formPrix;
 }

 exportExcel() {
  this.articleService.exportServiceToExcel().subscribe(
    (data: Blob) => {
      data.arrayBuffer().then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Augmenter la largeur des colonnes
        if (worksheet['!ref']) {
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const cols: XLSX.ColInfo[] = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            cols.push({ wch: 20 }); // Définir la largeur à 15
          }
          worksheet['!cols'] = cols;
        }

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exportService.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    (err) => {
      console.log(err);
    }
  );
}


couleurs: string[] = ['#FFEB3B', '#CDDC39', '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#00BCD4', '#8BC34A'];
etiquette = { nom: '', couleur: '' };
etiquettes: { nom: string, couleur: string }[] = [];

selectionnerCouleur(couleur: string) {
  this.etiquette.couleur = couleur;
}

ajouterEtiquette() {
  if (this.etiquette.nom && this.etiquette.couleur) {
    this.etiquettes.push({ ...this.etiquette });
    this.etiquette.nom = '';
    this.etiquette.couleur = '';
  }
}

supprimerEtiquette(index: number) {
  this.etiquettes.splice(index, 1);
}

ouvrirModalArticle(){
  // Utiliser l'API DOM pour ouvrir le modal
  const modal = document.getElementById('exampleModal');
  if (modal) {
    // @ts-ignore
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }
}
 
}
