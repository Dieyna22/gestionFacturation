import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';
import { PromoService } from 'src/app/services/promo.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent {
// Déclaration des variables 
tabPromo: any[] = [];
tabPromoFilter: any[] = [];

filterValue: string = "";
nom: string = "";
pourcentage: string = "";
date: string = "";


inputPourcentage: string = "";
inputNom: string = "";
inputDate: string = "";
inputEntreprise: string = "";
inputClient: string = "";
inputAdress: string = "";
inputTelephone: string = "";



constructor(private http: HttpClient,private promoService:PromoService, private clientService:ClientsService) { }


showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

ngOnInit(): void {
 this.listePromos();
}


ajouterPromos(){
 let promos={
   "nom_promo":this.nom,
   "pourcentage_promo":this.pourcentage,
   "date_expiration":this.date,
 }
 this.promoService.addPromo(promos).subscribe(
   (promo:any)=>{
    Report.success('Notiflix Success',promo.message,'Okay',);
     this.vider();
     this.listePromos();
     this.nom='';
     this.pourcentage='';
     this.date='';
   },
   (err) => {
   }
 )
}

listePromos() {
 this.promoService.getAllPromo().subscribe(
   (promos: any) => {
     this.tabPromo = promos;
     this.tabPromoFilter = this.tabPromo;
   },
   (err) => {
   }
 )
}

// méthode pour vider les champs
vider(){
 this.nom='';
 this.pourcentage='';
 this.date='';

 this.inputNom='';
 this.inputPourcentage='';
 this.inputDate='';
}

deletePromo(paramPromo:any){
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
      this.promoService.deletePromo(paramPromo).subscribe(
        (response)=>{
         Notify.success(response.message);
          this.listePromos();
          Loading.remove();
        }
      )
    });

}

currentPromo: any;
// Methode pour charger les infos du zone  à modifier
chargerInfosPromo(paramPromo:any){
 this.currentPromo = paramPromo;
 this.inputNom = paramPromo.nom_promo;
 this.inputPourcentage = paramPromo.pourcentage_promo;
 this.inputDate = paramPromo.date_expiration;
}

updatePromo() {
  let promos={
    "nom_promo":this.inputNom,
    "pourcentage_promo":this.inputPourcentage,
    "date_expiration":this.inputDate,
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
      this.promoService.updatePromo(this.currentPromo.id,promos).subscribe(
        (reponse)=>{
         Notify.success(reponse.message);
         this.listePromos();
         this.vider();
         Loading.remove();
        }
      )
    });
} 

// Methode de recherche automatique pour un utilisateur
onSearch() {
 // Recherche se fait selon le nom ou le prenom 
 this.tabPromoFilter = this.tabPromo.filter(
   (elt: any) => (elt?.nom_promo.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.pourcentage_promo.toLowerCase().includes(this.filterValue.toLowerCase()))
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
 return this.tabPromoFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabPromoFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabPromoFilter.length / this.itemsParPage);
}
}
