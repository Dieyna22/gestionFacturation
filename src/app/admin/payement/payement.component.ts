import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { PayementService } from 'src/app/services/payement.service';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent {

   
// Déclaration des variables 
tabPayement: any[] = [];
tabPayementFilter: any[] = [];
inputPayement:string="" ;
payement:string="";

constructor(private http: HttpClient,private payementService:PayementService) { }

ajouterPayement() {
 let payement ={
   "nom_payement":this.inputPayement,
 }

 this.payementService.addPayement(payement).subscribe(
   (response) => {
    Report.success('Notiflix Success',response.message,'Okay',);
   this.listePayement();
   this.inputPayement='';
 }
);
}

ngOnInit(): void {
 this.listePayement();
}

listePayement() {
 this.payementService.getAllPayement().subscribe(
   (paye: any) => {
     this.tabPayement = paye;
     this.tabPayementFilter = this.tabPayement;
   },
   (err) => {
   }
 )
}

CurrentCategorie: any;
chargerInfosCategorie(paramCategorie:any){
    this.CurrentCategorie = paramCategorie;
    this.payement = paramCategorie.nom_payement;
}

updateCategorie() {
  let payement={
    "nom_payement":this.payement,
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
      this.payementService.updatePayement(this.CurrentCategorie.id,payement).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listePayement();
          this.payement='';
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
      this.payementService.deletePayement(categorieId).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listePayement();
          Loading.remove();
        }
      )
    });
}

filterValue: string = "";
onSearch() {
  // Recherche se fait selon le nom ou le prenom 
  this.tabPayementFilter = this.tabPayement.filter(
    (elt: any) => (elt?.nom_payement.toLowerCase().includes(this.filterValue.toLowerCase()))
  );
 }

itemsParPage = 4; // Nombre d'articles par page
pageActuelle = 1; // Page actuelle

// Pagination 
// Méthode pour déterminer les articles à afficher sur la page actuelle
getItemsPage(): any[] {
 const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
 const indexFin = indexDebut + this.itemsParPage;
 return this.tabPayementFilter.slice(indexDebut, indexFin);
}

// // Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabPayementFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// // Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabPayementFilter.length / this.itemsParPage);
}
}
