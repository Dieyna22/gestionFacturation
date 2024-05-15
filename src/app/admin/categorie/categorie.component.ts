import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';

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
   alert(response);
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
  this.Categorie.updateCategorie(this.CurrentCategorie.id,categories).subscribe(
    (reponse)=>{
      alert(reponse)
      this.listeCategorie();
      this.categorie='';
    }
  )
}

deleteCategorie(categorieId:any){
  this.Categorie.deleteCategorie(categorieId).subscribe(
    (reponse)=>{
      alert(reponse)
      this.listeCategorie();
    }
  )
}

itemsParPage = 3; // Nombre d'articles par page
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
