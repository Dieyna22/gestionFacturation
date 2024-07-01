import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent {
// Déclaration des variables 
tabCategorie: any[] = [];
tabCategorieFilter: any[] = [];
inputCategorie:string="" ;
categorie:string="";

constructor(private http: HttpClient, private Categorie: CategorieService) { }

ajouterCategorie() {
 let categorie ={
   "nom_categorie":this.inputCategorie
 }

 this.Categorie.addCategorie(categorie).subscribe(
   (response) => {
    Report.success('Notiflix Success',response.message,'Okay',);
   this.listeCategorie();
   this.inputCategorie='';
 }
);
}

ngOnInit(): void {
 this.listeCategorie();
}

listeCategorie() {
 this.Categorie.getAllCategorie().subscribe(
   (categories: any) => {
     this.tabCategorie = categories.CategorieClient;
     this.tabCategorieFilter = this.tabCategorie;
   },
   (err) => {
   }
 )
}

CurrentCategorie: any;
chargerInfosCategorie(paramCategorie:any){
    this.CurrentCategorie = paramCategorie;
    this.categorie = paramCategorie.nom_categorie;
}

updateCategorie() {
  let categories={
    "nom_categorie":this.categorie,
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
      this.Categorie.updateCategorie(this.CurrentCategorie.id,categories).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listeCategorie();
          this.categorie='';
          Loading.remove();
        }
      );
    });
  
}

deleteCategorie(categorieId:any){
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
      this.Categorie.deleteCategorie(categorieId).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listeCategorie();
          Loading.remove();
        }
      )
    });
}

filterValue: string = "";
onSearch() {
  // Recherche se fait selon le nom ou le prenom 
  this.tabCategorieFilter = this.tabCategorie.filter(
    (elt: any) => (elt?.nom_categorie.toLowerCase().includes(this.filterValue.toLowerCase()))
  );
 }

itemsParPage = 2; // Nombre d'articles par page
pageActuelle = 1; // Page actuelle

// Pagination 
// Méthode pour déterminer les articles à afficher sur la page actuelle
getItemsPage(): any[] {
 const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
 const indexFin = indexDebut + this.itemsParPage;
 return this.tabCategorieFilter.slice(indexDebut, indexFin);
}

// // Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabCategorieFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// // Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabCategorieFilter.length / this.itemsParPage);
}
}
