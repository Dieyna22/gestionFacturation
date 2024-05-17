import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { PromoService } from 'src/app/services/promo.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent {
// Déclaration des variables 
tabArticle: any[] = [];
tabArticleFilter: any[] = [];
tabPromo: any[] = []

filterValue: string = "";
nom: string = "";
desc: string = "";
prix: string = "";
typeArticle: string = "";

inputnom: string = "";
inputdesc: string = "";
inputprix: string = "";
inputtypeArticle: string = "";
inputpromo: string = "";




constructor(private http: HttpClient, private articleService:ArticlesService,private promoService:PromoService) { }



ngOnInit(): void {
 this.listeArticles();
 this.listePromos();
}




ajouterArticle(){
 let articles={
   "nom_article":this.nom,
   "description":this.desc,
   "prix_unitaire":this.prix,
   "type_article":this.typeArticle,
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
     this.tabArticleFilter = this.tabArticle;
   },
   (err) => {
   }
 )
}

// méthode pour vider les champs
vider(){
 this.nom='';
 this.desc='';
 this.prix='';
 this.typeArticle='';

 this.inputnom='';
 this.inputdesc='';
 this.inputprix='';
 this.inputtypeArticle='';
 

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
 this.inputprix = paramArticle.prix_unitaire;
 this.inputtypeArticle = paramArticle.type_article;
}

updateArticle() {
  let articles={
    "nom_article":this.inputnom,
    "description":this.inputdesc,
    "prix_unitaire":this.inputprix,
    "type_article":this.inputtypeArticle,
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
      this.tabPromo = promos;
    },
    (err) => {
    }
  )
 }

 idArticle:any;
 recupIdArticle(paramArticle:any){
  this.idArticle=paramArticle;
  console.log(this.idArticle);
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
   (elt: any) => (elt?.nom_article.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.type_article.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prix_unitaire.toLowerCase().includes(this.filterValue.toLowerCase()))
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
}
