import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { VenteService } from 'src/app/services/vente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private http: HttpClient,private userService: UtilisateurService,private docService: VenteService,private clientService: ClientsService,private articleService: ArticlesService,) {}

  ngOnInit() {
    this.listeFacture();
    this.listeArticles();
    this.listeBonCommande();
    this.listeBonLivraison();
    this.listeClients();
    this.listeUserArchiver();
    this.listeUserNoArchiver();
  }

  factureImpayer: any[] =[];
  facturePayer: any[] =[];
  tabFactures: any[] = [];
  listeFacture() {
    this.docService.getAllFacture().subscribe(
      (factures) => {
        this.tabFactures = factures.factures;
        this.factureImpayer = factures.factures.filter((fact: any) => fact.statut_paiement == 'en_attente');
        this.facturePayer = factures.factures.filter((fact: any) => fact.statut_paiement == 'payer');
        console.log(this.tabFactures)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabDevis: any[] = [];
  listeDevis() {
    this.docService.getAllDevis().subscribe(
      (devis) => {
        this.tabDevis = devis.devis;
    
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabClient: any[] = [];
  listeClients() {
    this.clientService.getAllClients().subscribe(
      (clients: any) => {
        this.tabClient = clients;
      },
      (err) => {
      }
    )
  }

  tabUserNoArchiver: any[] = [];
  listeUserNoArchiver() {
    this.userService.getAllUserNoArchiver().subscribe(
      (userNoArchiver: any) => {
        this.tabUserNoArchiver = userNoArchiver;
      },
      (err) => {
      }
    )
  }

  tabUserArchiver: any[] = [];
  listeUserArchiver() {
    this.userService.getAllUserArchiver().subscribe(
      (userArchiver: any) => {
        this.tabUserArchiver = userArchiver;
      },
      (err) => {
      }
    )
   }

   tabService: any[] = [];
   tabArticle: any[] = [];
   listeArticles() {
     this.articleService.getAllArticles().subscribe(
       (article: any) => {
         this.tabArticle = article.filter((article: any) => article.type_article == 'produit');
         this.tabService = article.filter((article: any) => article.type_article == 'service');
       },
       (err) => {
         console.log(err);
       }
     )
   }

   tabBonCommande: any[] = [];
  listeBonCommande() {
    this.docService.getAllBonCommande().subscribe(
      (bonCommande) => {
        this.tabBonCommande = bonCommande.BonCommandes;
        console.log(this.tabBonCommande);
      },
      (err) => {
        console.log(err);
      }
    )
  }


  tabLivraison: any;
  listeBonLivraison() {
    this.docService.getAllBonLivraison().subscribe(
      (bonLivraisons) => {
        this.tabLivraison = bonLivraisons.livraisons;
        console.log(this.tabLivraison)
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
