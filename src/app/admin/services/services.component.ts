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



inputnom: string = "";
inputdesc: string = "";
inputvente: string = "";
inputachat: string = "";
inputquantite: string = "";
inputquantiteAlerte: string = "";
inputtypeArticle: string = "";
inputpromo: string = "";
inputCategorieArticle:string="";

isSuperAdmin: boolean = false;
isAdmin: boolean = false;
isUser: boolean = false;


constructor(private http: HttpClient, private articleService:ArticlesService,private promoService:PromoService,private Categorie: CategorieArticleService) { }



ngOnInit(): void {
 this.listeArticles();
 this.listePromos();

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

ajouterArticle(){
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

listeArticles() {
 this.articleService.getAllArticles().subscribe(
   (article: any) => {
     this.tabArticle = article.articles;
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

 this.inputnom='';
 this.inputdesc='';
 this.inputvente='';
 this.inputtypeArticle='';
 this.inputachat='';
 this.inputquantite='';
 this.inputquantiteAlerte='';
 this.inputCategorieArticle='';
 

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
}

updateArticle() {
  let articles={
    "nom_article":this.inputnom,
    "description":this.inputdesc,
    "prix_unitaire":this.inputvente,
    "type_article":this.currentArticle.type_article,
    "prix_achat":this.inputachat,
    "quantite":this.inputquantite,
    "quantite_alert":this.inputquantiteAlerte,
    "id_categorie_article":this.inputCategorieArticle,

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
}
