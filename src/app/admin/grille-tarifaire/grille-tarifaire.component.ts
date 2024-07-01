import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { GrilleTarifaireService } from 'src/app/services/grille-tarifaire.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-grille-tarifaire',
  templateUrl: './grille-tarifaire.component.html',
  styleUrls: ['./grille-tarifaire.component.css']
})
export class GrilleTarifaireComponent {

  tabClient: any[] = [];
  tabGrille:any[] = [];
  tabGrilleFilter:any[] = [];
  filterValue: string = "";

  client:String="";
  article:string="";
  montant:string="";
  tva:string="";

  inputclient:String="";
  inputarticle:string="";
  inputmontant:string="";
  inputtva:string="";




  constructor(private http: HttpClient,private clientService:ClientsService, private articleService:ArticlesService ,private grilleservice:GrilleTarifaireService) { }

  ngOnInit(){
    this.listeClients();
    this.listeArticles();
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
   products:any;
   listeArticles() {
     this.articleService.getAllArticles().subscribe(
       (article: any) => {
         this.products = article;
       },
       (err) => {
       }
     )
    }  



  ajouterGrilles(){
    let grille={
     "idClient":this.client,
     "idArticle":this.article,
     "montantTarif":this.montant,
     "tva":this.tva
    }
    this.grilleservice.addGrille(grille).subscribe(
      (user:any)=>{
        Report.success('Notiflix Success',user.message,'Okay',);
        this.viderChamps();
        this.listeGrille();
      },
      (err) => {
      }
    )
  }

  currentGrille: any;
// Methode pour charger les infos du zone  à modifier
chargerInfosGrille(paramGrille:any){
 this.currentGrille = paramGrille;
 console.log(paramGrille)
 this.inputclient=paramGrille.nom_client;
 this.inputarticle=paramGrille.nom_article;
 this.inputmontant=paramGrille.montant_tarif;
 this.inputtva=paramGrille.tva;
}

updateGrille() {
  let grille={
    "idClient":this.inputclient,
    "idArticle":this.inputarticle,
    "montantTarif":this.inputmontant,
    "tva":this.inputtva
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
      this.grilleservice.updateGrille(this.currentGrille.id,grille).subscribe(
        (reponse)=>{
         Notify.success(reponse.message);
          this.listeGrille();
          this.viderChamps();
          Loading.remove();
        }
      )
    });
}


idArticle:any;
idClient:any;
  listeGrille(){
    this.grilleservice.getAllGrille(this.idClient,this.idArticle).subscribe(
      (grille:any)=>{
        this.tabGrille=grille.grilles_tarifaires;
        this.tabGrilleFilter=this.tabGrille;
        console.log(this.tabGrille);
      },
      (err) => {
      }
    )
  }


  deleteGrille(paramClient:any){
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
        this.grilleservice.deleteGrille(paramClient).subscribe(
          (response)=>{
           Notify.success(response.message);
            this.listeGrille();
            Loading.remove();
          }
        )
      });
  }

  onSearch() {
    // Recherche se fait selon le nom ou le prenom 
    this.tabGrilleFilter = this.tabGrille.filter(
      (elt: any) => (elt?.nom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.nom_article.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
   }


  viderChamps(){
    this.client="";
    this.article="";
    this.montant="";
    this.tva="";
    this.inputclient="";
    this.inputarticle="";
    this.inputmontant="";
    this.inputtva="";
  }
  // Attribut pour la pagination
  itemsParPage = 3; // Nombre d'articles par page
  pageActuelle = 1; // Page actuelle

   // Pagination 
 // Méthode pour déterminer les articles à afficher sur la page actuelle
 getItemsPage(): any[] {
   const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
   const indexFin = indexDebut + this.itemsParPage;
   return this.tabGrilleFilter.slice(indexDebut, indexFin);
 }

 // Méthode pour générer la liste des pages
 get pages(): number[] {
   const totalPages = Math.ceil(this.tabGrilleFilter.length / this.itemsParPage);
   return Array(totalPages).fill(0).map((_, index) => index + 1);
 }

 // Méthode pour obtenir le nombre total de pages
 get totalPages(): number {
   return Math.ceil(this.tabGrilleFilter.length / this.itemsParPage);
 }
}
