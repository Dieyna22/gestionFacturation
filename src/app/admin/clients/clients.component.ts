import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { ClientsService } from 'src/app/services/clients.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
// Déclaration des variables 
tabClient: any[] = [];
tabClientFilter: any[] = [];
tabCategorie: any[] = [];

filterValue: string = "";
prenom: string = "";
nom: string = "";
mail: string = "";
typeClient: string = "";
entreprise: string = "";
adress: string = "";
telephone: string = "";



inputprenom: string = "";
inputnom: string = "";
inputmail: string = "";
inputEntreprise: string = "";
inputClient: string = "";
inputAdress: string = "";
inputTelephone: string = "";



constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private clientService:ClientsService) { }


showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

ngOnInit(): void {
 this.listeCategorie();
 this.listeClients();
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

listeClients() {
 this.clientService.getAllClients().subscribe(
   (clients: any) => {
     this.tabClient = clients.clients;
     this.tabClientFilter = this.tabClient;
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

 this.inputnom='';
 this.inputprenom='';
 this.inputmail='';
 this.inputEntreprise='';
 this.inputClient='';
 this.inputTelephone='';
 this.inputAdress='';

}

deleteClient(paramClient:any){
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
      this.clientService.deleteClient(paramClient).subscribe(
        (response)=>{
         Notify.success(response.message);
          this.listeClients();
          Loading.remove();
        }
      )
    });
}

currentClient: any;
// Methode pour charger les infos du zone  à modifier
chargerInfosClient(paramClient:any){
 this.currentClient = paramClient;
 this.inputnom = paramClient.nom_client;
 this.inputprenom = paramClient.prenom_client;
 this.inputmail = paramClient.email_client;
 this.inputClient = paramClient.categorie_id;
 this.inputEntreprise =paramClient.nom_entreprise;
 this.inputTelephone = paramClient.tel_client;
 this.inputAdress = paramClient.adress_client;
}

updateUser() {
  let clients={
    "nom_client":this.inputnom,
    "prenom_client":this.inputprenom,
    "nom_entreprise":this.inputEntreprise,
    "adress_client":this.inputAdress,
    "email_client":this.inputmail,
    "tel_client":this.inputTelephone,
    "categorie_id":this.inputClient,
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
      this.clientService.updateClient(this.currentClient.id,clients).subscribe(
        (reponse)=>{
         Notify.success(reponse.message);
          this.listeClients();
          this.vider();
          Loading.remove();
        }
      )
    });
} 

// Methode de recherche automatique pour un utilisateur
onSearch() {
 // Recherche se fait selon le nom ou le prenom 
 this.tabClientFilter = this.tabClient.filter(
   (elt: any) => (elt?.nom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.nom_entreprise.toLowerCase().includes(this.filterValue.toLowerCase()))
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
 return this.tabClientFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabClientFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabClientFilter.length / this.itemsParPage);
}
}
