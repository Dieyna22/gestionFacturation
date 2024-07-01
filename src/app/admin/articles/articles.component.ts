import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { PromoService } from 'src/app/services/promo.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CategorieArticleService } from 'src/app/services/categorie-article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent {
// Déclaration des variables 
tabArticle: any[] = [];
tabArticleFilter: any[] = [];
tabPromo: any[] = [];
tabCategorie: any[] = [];
dbUsers: any;
role: string = ''
tabEntrepot: any[] =[];

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
entrepotName:string="";
addEntrepot:string="";
Lotnom:string="";
Lotquantite:string="";
nomVariantes:string="";
quantiteVariantes:string="";
quantiteInEntrepot:string="";


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
inputentrepotName: string = "";
inputLotnom: string = "";
inputLotquantite: string = "";
inputnomVariantes: string = "";
inputquantiteVariantes: string = "";
inputquantiteInEntrepot: string = "";
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
 this.listeEntrepot();

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

ajouterEntrepot(){
  let entrepot={
    "nom_entrepot":this.addEntrepot,
  }
  this.articleService.addEntrepot(entrepot).subscribe(
    (entrepot:any)=>{
      Report.success('Notiflix Success',entrepot.message,'Okay',);
      this.vider();
      this.listeArticles();
    },
    (err) => {
    }
  )
}

listeEntrepot(){
  this.articleService.getAllEntrepot().subscribe(
    (entrepot:any)=>{
      this.tabEntrepot=entrepot;
    },
    (err) => {
    }
  )
}

ajouterArticle(){
let articles={
  "nom_article": this.nom,
  "description": this.desc,
  "prix_achat":this.achat,
  "prix_unitaire": this.vente,
  "tva": this.tva,
  "type_article": "produit",
  "unité": this.unite,
  "quantite": this.quantite,
  "quantite_alert":this.quantiteAlerte,
  "id_categorie_article":this.CategorieArticle,
  "autres_prix": [
    {
      "titrePrix": this.titrePrix,
      "montant": this.prixVente,
      "tva": this.tvaPrix
    }
  ],
  "variantes": [
    {
      "nomVariante": this.nomVariantes,
      "quantiteVariante": this.quantiteVariantes
    }
  ],
  "lots": [
    {
      "nomLot": this.Lotnom,
      "quantiteLot": this.Lotquantite
    }
  ],
  "entrepots": [
    {
      "entrepot_id": this.entrepotName,
      "quantiteArt_entrepot": this.quantiteInEntrepot
    }
  ]
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
     this.tabArticleFilter = this.tabArticle.filter((article: any) => article.type_article == 'produit');
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
 this.titrePrix='';
 this.tvaPrix='';
 this.prixVente='';
 this.entrepotName='';
 this.addEntrepot='';
 this.Lotnom='';
 this.Lotquantite='';
 this.nomVariantes='';
 this.quantiteVariantes='';
 this.quantiteInEntrepot='';

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
 this.inputentrepotName='';
 this.inputLotnom='';
 this.inputLotquantite='';
 this.inputnomVariantes='';
 this.inputquantiteVariantes='';
 this.inputquantiteInEntrepot='';
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
  console.log(paramArticle);
 this.currentArticle = paramArticle;
 this.inputnom = paramArticle.nom_article;
 this.inputdesc = paramArticle.description;
 this.inputvente = paramArticle.prix_unitaire;
 this.inputtypeArticle = paramArticle.type_article;
 this.inputachat=paramArticle.prix_achat;
 this.inputquantite=paramArticle.quantite;
 this.inputquantiteAlerte=paramArticle.quantite_alert;
 this.inputCategorieArticle=paramArticle.id_categorie_article;
 this.inputunite=paramArticle.unité;
 this.inputtva=paramArticle.tva;
//  this.inputentrepotName=paramArticle.entrepots[0].entrepot_id;
//  this.inputLotnom=paramArticle.lots[0].nomLot;
//  this.inputLotquantite=paramArticle.lots[0].quantiteLot;
//  this.inputnomVariantes=paramArticle.variantes[0].nomVariante;
//  this.inputquantiteVariantes=paramArticle.variantes[0].quantiteVariante;
//  this.inputquantiteInEntrepot=paramArticle.entrepots[0].quantiteArt_entrepot;
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
    "quantite":this.inputquantite,
    "quantite_alert":this.inputquantiteAlerte,
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
    "variantes": [
      {
        "nomVariante": this.inputnomVariantes,
        "quantiteVariante": this.inputquantiteVariantes
      }
    ],
    "lots": [
      {
        "nomLot": this.inputLotnom,
        "quantiteLot": this.inputLotquantite
      }
    ],
    "entrepots": [
      {
        "entrepot_id": this.inputentrepotName,
        "quantiteArt_entrepot": this.inputquantiteInEntrepot
      }
    ]

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

updateStockArticle() {
  let stock={
    "quantite":this.inputquantite,
    "note":this.note,
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
      this.articleService.updateStockArticle(this.currentArticle.id,stock).subscribe(
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
          this.listeArticles();
          Loading.remove();
        },
        (err) => {
        }
      )
    });
  
 }

 listeCategorie() {
 this.Categorie.getAllCategorieArticle().subscribe(
   (categories: any) => {
     this.tabCategorie = categories.CategorieArticle;
   },
   (err) => {
   }
 )
}

affecterCategorieArticle(){
  let CategorieArticle={
    "id_categorie_article":this.inputCategorieArticle,
  }
  Confirm.init({
    okButtonBackground: '#5C6FFF',
    titleColor: '#5C6FFF'
  });
  Confirm.show('Confirmation ',
  'Voullez-vous vous affecter une catégorie à cette article?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.articleService.affecterCategorieArticle(this.idArticle,CategorieArticle).subscribe(
        (response) => {
          Notify.success(response.message);
          this.listeArticles();
          Loading.remove();
        },
        (err) => {
        }
      )
    });
  
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

entrepot: boolean=false;
afficherChampsEntrepot(){
  this.entrepot=!this.entrepot;
}

lot:boolean=false;
afficherChampsLot(){
  this.lot=!this.lot;
}

variantes:boolean=false;
afficherChampsVariantes(){
  this.variantes=!this.variantes;
}

}
