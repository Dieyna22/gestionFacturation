import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxPrintModule } from 'ngx-print';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CategorieService } from 'src/app/services/categorie.service';
import { PayementService } from 'src/app/services/payement.service';
import { GrilleTarifaireService } from 'src/app/services/grille-tarifaire.service';
import { VenteService } from 'src/app/services/vente.service';
import * as XLSX from 'xlsx';
import { EtiquetteService } from '../../services/etiquette.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

interface Echeance {
  date: string;
  montant: number;
}

interface Etiquette {
  id?: number;
  nom_etiquette: string;
  code_etiquette: string;
}

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent {

  dbUsers: any;
  tabClient: any[] = [];
  clientId: string = "";
  filterValue: string = "";
  tabCategorie: any[] = [];

  prenom: string = "";
  nom: string = "";
  mail: string = "";
  typeClient: string = "";
  entreprise: string = "";
  adress: string = "";
  telephone: string = "";

  selectedPrefix: string = '';
  customPrefix: string = '';
  nextNumber: string = '00000';
  nextNumberDevis: string = '00000';
  nextNumberBonCommande: string = '00000';
  nextNumberBonLivraison: string = '00000';
  baseNumber: string = '00000';
  prefix: string = '';
  updateNum: string = '';
  numerotation: string = '';


  desc: string = "";
  vente: string = "";
  typeArticle: string = "";
  achat: string = "";
  quantite: string = "";
  quantiteAlerte: string = "";
  CategorieArticle: string = "";
  note: string = "";
  moyenPayement: string = "";
  typePaiement: string = "";
  tabGrille: any;
  acompte: string = "";
  dateDebut: string = "";
  dateFin: string = "";
  totalAcompte: string = "";
  montantAcompte: string = "";
  commentaire: string = "";
  datedevis: string = '';
  datevaliditeDevis: string = '';

  constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private articleService: ArticlesService, private clientService: ClientsService, private userService: UtilisateurService, private productService: ArticlesService, private renderer: Renderer2, private payementService: PayementService, private grilleservice: GrilleTarifaireService, private docService: VenteService, private etiquetteService: EtiquetteService, private filterService: ConfigurationService) {
    this.currentDate = this.getCurrentDate();
  }
  actif = 1
  actifD = 1
  actifBC = 1
  actifCL = 1

  // Gestion bouton
  boutonActif = 1;

  sectionFacture = 1;

  //model active
  modelActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = ' ';

  titre: string = 'Facture';
  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
  }

  currentDoc: string = 'Facture'
  showTypeDocument(docId: string): void {
    this.currentDoc = docId
    this.titre = docId;
  }

  typeDocument = 'vente';
  setTypeDocument(typeDoc: string) {
    this.typeDocument = typeDoc;
  }

  currentModel: string = 'bloc'

  // Mettre à jour le modèle actuel
  showModel(modelId: string): void {
    this.currentModel = modelId;
  }

  currentfactureType: string = 'tout'
  showfactureType(typeID: string) {
    this.currentfactureType = typeID
  }

  currentDetail: string = 'Récapitulatif'
  showDetailFacture(detailId: string) {
    this.currentDetail = detailId
  }

  currentNumConfig: string = 'sansPrefixes';
  showNumConfig(configId: string) {
    this.currentNumConfig = configId
  }


  ngAfterViewInit() {
    this.updateTableHeaderColor();
  }

  filterliste: any[] = [];
  filterFactures(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabFactures, filterTerm, ['statut_paiement']);
    if (this.filterliste.length == 0) {
      this.listeFacture();
    } else {
      this.tabFactureFilter = this.filterliste;
    }
  }

  filterDevis(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabDevis, filterTerm, ['statut_devi', 'archiver']);
    if (this.filterliste.length == 0) {
      this.listeDevis();
    } else {
      this.tabFactureFilter = this.filterliste;
    }
  }

  filterBonCommande(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabBonCommande, filterTerm, ['statut_BonCommande', 'active_Stock']);
    if (this.filterliste.length == 0) {
      this.listeBonCommande();
    } else {
      this.tabFactureFilter = this.filterliste;
    }
  }


  filterBonLivraison(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabLivraison, filterTerm, ['statut_livraison', 'active_Stock']);
    if (this.filterliste.length == 0) {
      this.listeBonLivraison();
    } else {
      this.tabFactureFilter = this.filterliste;
    }
  }

  tabAcompte: any[] = [];
  ngOnInit() {
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.updatePrefix();

    if (!localStorage.getItem("tabAcompte")) {
      localStorage.setItem("tabAcompte", JSON.stringify(this.tabAcompte));
    }

    this.tabAcompte = JSON.parse(localStorage.getItem("tabAcompte") || '[]');

    this.initializeData();

    this.listeFacture();
    this.listeClients();
    this.listeInfoSup();
    this.listeArticles();
    this.listeCategorie();
    this.listePayement();
    this.listeNumber();
    this.listeNumberDevis();
    this.listeNumberBonCommande();
    this.listeNumberBonLivraison();
    this.listeEtiquette();
    this.listeModelByTypeDocument();


    // this. listeFactureRecurrente();
  }
  currentDate: string = new Date().toISOString().split('T')[0];


  configurationNumero() {
    let numFacture =
    {
      type_document: 'facture',
      type_numerotation: this.numerotation,
      prefixe: this.customPrefix,
      format: this.selectedPrefix,
    }

    this.docService.configNumero(numFacture).subscribe(
      (response) => {
        console.log('Configuration numero : ', response);
      },
      (error) => {
        console.error('Erreur lors de la configuration du numérotation : ', error);
      }
    )
  }

  configurationNumeroDevis() {
    let numFacture =
    {
      type_document: 'devis',
      type_numerotation: this.numerotation,
      prefixe: this.customPrefix,
      format: this.selectedPrefix,
    }

    this.docService.configNumero(numFacture).subscribe(
      (response) => {
        console.log('Configuration numero : ', response);
      },
      (error) => {
        console.error('Erreur lors de la configuration du numérotation : ', error);
      }
    )
  }

  configurationNumeroBonCommande() {
    let numFacture =
    {
      type_document: 'commande',
      type_numerotation: this.numerotation,
      prefixe: this.customPrefix,
      format: this.selectedPrefix,
    }

    this.docService.configNumero(numFacture).subscribe(
      (response) => {
        console.log('Configuration numero : ', response);
      },
      (error) => {
        console.error('Erreur lors de la configuration du numérotation : ', error);
      }
    )
  }

  configurationNumeroBonLivraison() {
    let numFacture =
    {
      type_document: 'livraison',
      type_numerotation: this.numerotation,
      prefixe: this.customPrefix,
      format: this.selectedPrefix,
    }

    this.docService.configNumero(numFacture).subscribe(
      (response) => {
        console.log('Configuration numero : ', response);
      },
      (error) => {
        console.error('Erreur lors de la configuration du numérotation : ', error);
      }
    )
  }

  formatFinal: any
  tabNum: any[] = [];
  numComplet: any
  listeNumber() {
    const now = new Date();
    this.docService.getAllNumeroFacture().subscribe(
      (response) => {
        if (response.configuration && response.configuration.length > 0) {
          this.tabNum = response.configuration;
          console.log('Liste des numéros : ', response);

          const config = this.tabNum[0];
          let prefixe = String(config.prefixe).toLowerCase();
          let format = config.format;
          let compteur = parseInt(config.compteur) || 0;

          console.log('Prefixe:', prefixe);
          console.log('Format:', format);
          console.log('Compteur:', compteur);

          // Génère la partie date du numéro
          let datePart = '';
          switch (format) {
            case 'annee':
              datePart = now.getFullYear().toString();
              break;
            case 'annee_mois':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
              break;
            case 'annee_mois_jour':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
              break;
            default:
              datePart = '';
          }

          // Incrémente le compteur
          compteur++;

          // Formate le numéro complet
          this.numComplet = `${prefixe}${datePart}${compteur.toString().padStart(6, '0')}`;

          // Le prochain numéro est identique au numéro complet
          this.nextNumber = this.numComplet;

          console.log('Numéro complet : ', this.numComplet);
          console.log('Prochain numéro : ', this.nextNumber);
        } else {
          console.error('Pas de configuration trouvée dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des numéros : ', error);
      }
    );
  }

  updatePrefix() {
    const now = new Date();
    let datePart = '';

    switch (this.selectedPrefix) {
      case 'custom':
        this.prefix = this.customPrefix;
        break;
      case 'annee':
        datePart = now.getFullYear().toString();
        break;
      case 'annee_mois':
        datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'annee_mois_jour':
        datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        break;
    }

    if (this.selectedPrefix !== 'custom') {
      this.prefix = this.customPrefix + datePart;
    }

    this.nextNumber = this.prefix + this.baseNumber + 1;
    this.nextNumberDevis = this.prefix + this.baseNumber + 1;
    this.nextNumberBonCommande = this.prefix + this.baseNumber + 1;
    this.nextNumberBonLivraison = this.prefix + this.baseNumber + 1;
  }


  listeNumberDevis() {
    const now = new Date();
    this.docService.getAllNumeroDevis().subscribe(
      (response) => {
        if (response.configuration && response.configuration.length > 0) {
          this.tabNum = response.configuration;
          console.log('Liste des numéros : ', response);

          const config = this.tabNum[0];
          let prefixe = String(config.prefixe).toLowerCase();
          let format = config.format;
          let compteur = parseInt(config.compteur) || 0;

          console.log('Prefixe:', prefixe);
          console.log('Format:', format);
          console.log('Compteur:', compteur);

          // Génère la partie date du numéro
          let datePart = '';
          switch (format) {
            case 'annee':
              datePart = now.getFullYear().toString();
              break;
            case 'annee_mois':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
              break;
            case 'annee_mois_jour':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
              break;
            default:
              datePart = '';
          }

          // Incrémente le compteur
          compteur++;

          // Formate le numéro complet
          this.numComplet = `${prefixe}${datePart}${compteur.toString().padStart(6, '0')}`;

          // Le prochain numéro est identique au numéro complet
          this.nextNumberDevis = this.numComplet;

          console.log('Numéro complet : ', this.numComplet);
          console.log('Prochain numéro : ', this.nextNumberDevis);
        } else {
          console.error('Pas de configuration trouvée dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des numéros : ', error);
      }
    );
  }

  listeNumberBonCommande() {
    const now = new Date();
    this.docService.getAllNumeroBonCommande().subscribe(
      (response) => {
        if (response.configuration && response.configuration.length > 0) {
          this.tabNum = response.configuration;
          console.log('Liste des numéros : ', response);

          const config = this.tabNum[0];
          let prefixe = String(config.prefixe).toLowerCase();
          let format = config.format;
          let compteur = parseInt(config.compteur) || 0;

          console.log('Prefixe:', prefixe);
          console.log('Format:', format);
          console.log('Compteur:', compteur);

          // Génère la partie date du numéro
          let datePart = '';
          switch (format) {
            case 'annee':
              datePart = now.getFullYear().toString();
              break;
            case 'annee_mois':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
              break;
            case 'annee_mois_jour':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
              break;
            default:
              datePart = '';
          }

          // Incrémente le compteur
          compteur++;

          // Formate le numéro complet
          this.numComplet = `${prefixe}${datePart}${compteur.toString().padStart(6, '0')}`;

          // Le prochain numéro est identique au numéro complet
          this.nextNumberBonCommande = this.numComplet;

          console.log('Numéro complet : ', this.numComplet);
          console.log('Prochain numéro : ', this.nextNumberBonCommande);
        } else {
          console.error('Pas de configuration trouvée dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des numéros : ', error);
      }
    );
  }

  listeNumberBonLivraison() {
    const now = new Date();
    this.docService.getAllNumeroBonLivraison().subscribe(
      (response) => {
        if (response.configuration && response.configuration.length > 0) {
          this.tabNum = response.configuration;
          console.log('Liste des numéros : ', response);

          const config = this.tabNum[0];
          let prefixe = String(config.prefixe).toLowerCase();
          let format = config.format;
          let compteur = parseInt(config.compteur) || 0;

          console.log('Prefixe:', prefixe);
          console.log('Format:', format);
          console.log('Compteur:', compteur);

          // Génère la partie date du numéro
          let datePart = '';
          switch (format) {
            case 'annee':
              datePart = now.getFullYear().toString();
              break;
            case 'annee_mois':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
              break;
            case 'annee_mois_jour':
              datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
              break;
            default:
              datePart = '';
          }

          // Incrémente le compteur
          compteur++;

          // Formate le numéro complet
          this.numComplet = `${prefixe}${datePart}${compteur.toString().padStart(6, '0')}`;

          // Le prochain numéro est identique au numéro complet
          this.nextNumberBonLivraison = this.numComplet;

          console.log('Numéro complet : ', this.numComplet);
          console.log('Prochain numéro : ', this.nextNumberBonLivraison);
        } else {
          console.error('Pas de configuration trouvée dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des numéros : ', error);
      }
    );
  }

  onSearch() {
    // Recherche se fait selon le nom ou le prenom 
    this.tabFactureFilter = this.tabFactures.filter(
      (elt: any) => (elt?.nom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.type_paiement.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.num_fact.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom_client.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
  }

  active: string = 'oui';
  setTypeActive(type: string) {
    this.active = type;
  }

  color: string = '#737171';

  onColorChange() {
    this.updateTableHeaderColor();

  }
  private updateTableHeaderColor() {
    const theadCells = document.querySelectorAll('thead tr th');
    theadCells.forEach((cell: any) => {
      this.renderer.setStyle(cell, 'background-color', this.color);
      this.renderer.setStyle(cell, 'color', 'white');
    });
  }


  ajouterUsers() {
    let clients = {
      "nom_client": this.nom,
      "prenom_client": this.prenom,
      "nom_entreprise": this.entreprise,
      "adress_client": this.adress,
      "email_client": this.mail,
      "tel_client": this.telephone,
      "categorie_id": this.typeClient,
    }
    this.clientService.addClient(clients).subscribe(
      (client: any) => {
        Report.success('Notiflix Success', client.message, 'Okay',);
        this.vider();
        this.listeClients();
      },
      (err) => {
      }
    )
  }


  // méthode pour vider les champs
  vider() {
    this.nom = '';
    this.prenom = '';
    this.mail = '';
    this.typeClient = '';
    this.entreprise = '';
    this.adress = '';
    this.telephone = '';
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

  listeCategorie() {
    this.ServiceCategorie.getAllCategorie().subscribe(
      (categories: any) => {
        this.tabCategorie = categories.CategorieClient;
      },
      (err) => {
      }
    )
  }

  showChamps: boolean = false;

  afficherChamps() {
    this.showChamps = !this.showChamps;
  }

  ajouterArticle() {
    let articles = {
      "nom_article": this.nom,
      "description": this.desc,
      "prix_unitaire": this.vente,
      "type_article": 'produit',
      "prix_achat": this.achat,
      "quantite": this.quantite,
      "quantite_alert": this.quantiteAlerte,
      "id_categorie_article": this.CategorieArticle,

    }
    this.articleService.addArticle(articles).subscribe(
      (article: any) => {
        Report.success('Notiflix Success', article.message, 'Okay',);
        this.vider();
        this.listeArticles();
      },
      (err) => {
      }
    )
  }


  ajouterService() {
    let articles = {
      "nom_article": this.nom,
      "description": this.desc,
      "prix_unitaire": this.vente,
      "type_article": 'service',
      "prix_achat": this.achat,
      "quantite": this.quantite,
      "quantite_alert": this.quantiteAlerte,
      "id_categorie_article": this.CategorieArticle,

    }
    this.articleService.addArticle(articles).subscribe(
      (article: any) => {
        Report.success('Notiflix Success', article.message, 'Okay',);
        this.vider();
        this.listeArticles();
      },
      (err) => {
      }
    )
  }

  selectedClient: any;
  currentClient: any;
  idCurrentClient: any;

  onClientSelected() {
    this.currentClient = this.tabClient.filter((client: any) => client.id == this.selectedClient);
    this.idCurrentClient = this.selectedClient
  }

  // currentDate: string;


  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }

  InfoSup: any;
  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup = infoSup.user;
      },
      (err) => {
      }
    )
  }

  tabPayement: any[] = [];
  listePayement() {
    this.payementService.getAllPayement().subscribe(
      (paye: any) => {
        this.tabPayement = paye;
      },
      (err) => {
      }
    )
  }



  listeGrille(row: any) {
    this.grilleservice.getAllGrille(this.selectedClient, row.selectedProduct).subscribe(
      (grille: any) => {
        this.tabGrille = grille.grilles_tarifaires.montant_tarif;
        row.grillePrice = this.tabGrille
      },
      (err) => {
      }
    )
  }


  priceByArticle: any;
  listePriceByArticle(row: any) {
    this.productService.getOtherPriceByArticle(row.selectedProduct).subscribe(
      (price: any) => {
        this.priceByArticle = price.autre_prix[0].montant;
        row.price = this.priceByArticle
      },
      (err) => {
      }
    )
  }

  totalHT: number = 0;
  totalTVA: number = 0;

  rows: any[] = [
    { selectedProduct: '', quantity: 0, unitPrice: 0, reductionArticle: 0, tva: 0, total: 0, totalTTC: 0 }
  ];

  addRow(): void {
    this.rows.push({ selectedProduct: '', quantity: 0, unitPrice: 0, reductionArticle: 0, tva: 0, total: 0, totalTTC: 0 });
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
    this.calculateGrandTotal();
    this.calculateGrandTotalAvecRemise();
    this.calculateTVA();
    this.calculateGrandTotalTTC();
  }

  prixHt: any;
  calculateTotal(row: any): void {
    row.total = row.quantity * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixHt = row.total;
    this.calculateGrandTotal();
    // this.calculateGrandTotalAvecRemise();
  }

  prixTTC: any;
  totalTTC: number = 0;
  calculateTotalTva(row: any): void {
    row.totalTTC = row.quantity * (1 + row.tva / 100) * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixTTC = row.totalTTC;
    // this.calculateGrandTotalAvecRemise();
    this.calculateGrandTotalTTC();
    this.calculateTVA();
  }


  total: number = 0;

  calculateGrandTotal(): void {
    this.total = this.rows.reduce((sum, row) => sum + row.total, 0);
  }

  calculateTVA(): void {
    this.totalTVA = this.rows.reduce((sum, row) => sum + (row.tva / 100) * row.quantity * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice), 0);
  }

  calculateGrandTotalTTC(): void {
    this.totalTTC = this.rows.reduce((sum, row) => sum + row.totalTTC, 0);
    this.calculateGrandTotalAvecRemise();
  }


  remise: number = 0;
  totalRemise: any;
  calculateGrandTotalAvecRemise(): number {
    this.totalRemise = this.totalTTC - this.remise;
    return this.totalRemise;
    // this.totalRemise = this.rows.reduce((sum, row) => sum + row.totalTTC - this.remise, 0) ;
  }

  products: any;
  listeArticles() {
    this.productService.getAllArticles().subscribe(
      (article: any) => {
        this.products = article;
      },
      (err) => {
      }
    )
  }

  productSelected: any;
  currentProduct: any;
  onProductSelect(row: any): void {
    this.currentProduct = this.products.filter((product: any) => product.id == row.selectedProduct);
    console.log(this.currentProduct);
    row.unitPrice = this.currentProduct[0].prix_unitaire;
    row.promotionalPrice = this.currentProduct[0].prix_promo;
    this.productSelected = this.currentProduct[0].nom_article;
  }


  removeLocalStorage() {
    localStorage.removeItem('tabAcompte');
  }

  createAcompte() {
    let factureAcompte =
    {
      "titreAccomp": this.acompte,
      "dateAccompt": this.dateDebut,
      "dateEcheance": this.dateFin,
      "montant": this.montantAcompte,
      "commentaire": this.commentaire,
      "num_facture": this.nextNumber,
    }

    this.tabAcompte.push(factureAcompte)
    localStorage.setItem("tabAcompte", JSON.stringify(this.tabAcompte));

  }

  naturefacture: string = "";
  noteFacture: string = "";
  createFacture() {
    this.naturefacture = this.typePaiement;
    let facture =
    {
      // "date_creation":this.date,
      "num_facture": this.nextNumber,
      "active_Stock": this.active,
      "client_id": this.selectedClient,
      "note_fact": this.noteFacture,
      "reduction_facture": this.remise,
      "type_paiement": this.typePaiement,
      "id_paiement": this.moyenPayement,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    },

      factureEcheance =
      {
        "client_id": this.selectedClient,
        "note_fact": this.noteFacture,
        "reduction_facture": this.remise,
        "type_paiement": this.typePaiement,
        "id_paiement": this.moyenPayement,
        "prix_HT": this.total,
        "prix_TTC": this.totalRemise,
        "articles": [] as Array<{
          id_article: number;
          quantite_article: number;
          prix_unitaire_article: number;
          TVA_article: number,
          reduction_article: number;
          prix_total_article: number,
          prix_total_tva_article: number
        }>,
        "echeances": [] as Array<{
          date_pay_echeance: string,
          montant_echeance: number,
        }>,
        "etiquettes": [] as Array<{
          id_etiquette: number,
        }>
      },

      factureAcompte =
      {
        "client_id": this.selectedClient,
        "note_fact": this.noteFacture,
        "reduction_facture": this.remise,
        "type_paiement": this.typePaiement,
        "id_paiement": this.moyenPayement,
        "prix_HT": this.total,
        "prix_TTC": this.totalRemise,
        "articles": [] as Array<{
          id_article: number;
          quantite_article: number;
          prix_unitaire_article: number;
          TVA_article: number,
          reduction_article: number;
          prix_total_article: number,
          prix_total_tva_article: number
        }>,
        "facture_accompts": [] as Array<{
          titreAccomp: string;
          dateAccompt: string;
          dateEcheance: string;
          montant: number,
          commentaire: string;
          num_facture: string;
        }>,
        "etiquettes": [] as Array<{
          id_etiquette: number,
        }>
      }

    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      facture.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      factureEcheance.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      factureAcompte.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      facture.etiquettes.push({
        id_etiquette: item,
      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      factureEcheance.etiquettes.push({
        id_etiquette: item,
      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      factureAcompte.etiquettes.push({
        id_etiquette: item,
      });
    }



    // Ajouter des échéances à la facture
    for (let i = 0; i < this.input.length; i++) {
      const item = this.input[i];
      factureEcheance.echeances.push({
        date_pay_echeance: item.date,
        montant_echeance: item.prix,
        // statut_paiement:"nonpayer",
      });
    }

    // Ajouter les acomptes à la facture
    for (let i = 0; i < this.tabAcompte.length; i++) {
      const item = this.tabAcompte[i];
      factureAcompte.facture_accompts.push({
        titreAccomp: item.titreAccomp,
        dateAccompt: item.dateAccompt,
        dateEcheance: item.dateEcheance,
        montant: item.montant,
        commentaire: item.commentaire,
        num_facture: item.num_facture
      });
      console.log(factureAcompte.facture_accompts);
    }

    // Envoyer la facture au service de facturation
    if (this.typePaiement == 'immediat') {
      this.docService.createFacture(facture).subscribe(
        (facture) => {
          console.log(facture.message);
          Report.success('Notiflix Success', facture.message, 'Okay',);
          this.listeFacture();
        },
        (err) => {
          console.log(err);
        }
      )
    } else if (this.typePaiement == 'echeance') {
      this.docService.createFacture(factureEcheance).subscribe(
        (facture) => {
          // console.log(facture.message);
          Report.success('Notiflix Success', facture.message, 'Okay',);
          this.listeFacture();
        },
        (err) => {
          console.log(err);
        }
      )
    } if (this.typePaiement == 'facture_Accompt') {
      this.docService.createFacture(factureAcompte).subscribe(
        (facture) => {
          alert(this.nextNumber)
          console.log(facture);
          Report.success('Notiflix Success', facture.message, 'Okay',);
          this.listeFacture();
          alert(2)
        },
        (err) => {
          console.log(err);
        }
      )
    }

  }

  innoviceNumber: any
  tabFactures: any[] = [];
  tabFactureFilter: any[] = [];
  listeFacture() {
    this.docService.getAllFacture().subscribe(
      (factures) => {
        this.tabFactures = factures.factures;
        this.innoviceNumber = factures.factures;
        this.tabFactureFilter = this.tabFactures;
        console.log('liste facture:', this.tabFactureFilter)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesImmediat: any[] = [];
  listeFactureImmediat() {
    this.docService.getAllFacture().subscribe(
      (factures) => {
        this.tabFacturesImmediat = factures.factures;
        this.tabFactureFilter = this.tabFacturesImmediat.filter((facture: any) => facture.type_paiement == 'immediat');
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesEcheance: any[] = []
  listeFactureEcheance() {
    this.docService.getAllFactureEcheance().subscribe(
      (factures) => {
        this.tabFacturesEcheance = factures.factures_echeance;
        this.tabFactureFilter = this.tabFacturesEcheance;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesAcompte: any[] = []
  listeFactureAcompte() {
    this.docService.getAllFactureAcompte().subscribe(
      (factures) => {
        this.tabFacturesAcompte = factures.factures_accompt;
        this.tabFactureFilter = this.tabFacturesAcompte;
        console.log(this.tabFacturesAcompte);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabFacturesAvoir: any[] = []
  listeFactureAvoir() {
    this.docService.getAllFactureAvoir().subscribe(
      (factures) => {
        this.tabFacturesAvoir = factures.factures;
        this.tabFactureFilter = this.tabFacturesAvoir;
        console.log(this.tabFacturesAvoir);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  // liste facture par client
  tabFactureClient: any[] = []
  listeFactureClient() {
    this.docService.getAllFactureByClient(this.idCurrentClient).subscribe(
      (factures) => {
        this.tabFactureClient = factures.factures_Payer;
        this.tabFactureFilter = this.tabFactureClient;
        console.log(this.tabFactureClient);
      },
      (err) => {
        console.log(err);
      }
    )
  }


  idFacture: any;
  numeroFacture: any;
  recupNumeroFacture(paramNumFacture: any) {
    this.numeroFacture = paramNumFacture.num_facture;
    this.idFacture = paramNumFacture.id;
  }



  client: any
  article: any
  echeance: any
  acompteFacture: any
  detailFacture: any;
  currentIdFacture: any
  currentNumFacture: any
  FactureId: any;
  details(paramFacture: any) {
    this.docService.DetailFacture(paramFacture).subscribe(
      (detail) => {
        this.detailFacture = detail.facture_details;
        console.log(this.detailFacture)
        this.client = this.detailFacture.client
        this.article = this.detailFacture.articles
        this.echeance = this.detailFacture.echeances
        this.acompteFacture = this.detailFacture.factures_accomptes
        this.currentIdFacture = this.detailFacture.id;
        this.currentNumFacture = this.detailFacture.numero_facture
        console.log(this.currentNumFacture);

        this.listeEcheanceFacture();
        this.listePaiementFacture();
        this.listeFacture();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  supprimerFacture(idFacture: any) {
    console.log(idFacture);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette facture?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteFacture(idFacture).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeFacture();
            Loading.remove()
          }
        )
      });
  }

  // liste echeance par facture
  tabEcheanceFacture: any[] = []
  listeEcheanceFacture() {
    this.docService.echeanceParFacture(this.currentIdFacture).subscribe(
      (echeances) => {
        this.tabEcheanceFacture = echeances.echeances;
        console.log(this.tabEcheanceFacture);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  datePrevu: string = '';
  dateRecu: string = '';
  montantEcheance: string = '';
  moyen: string = '';
  noteEcheance: string = '';
  currentItem: any;
  chargerInfosEcheance(paramEcheance: any) {
    this.currentItem = paramEcheance;
    this.datePrevu = paramEcheance.date_pay_echeance;
    this.montantEcheance = paramEcheance.montant_echeance;
    this.noteEcheance = paramEcheance.commentaire;
  }

  echeanceEnPayementRecu() {
    let item = {
      date_prevu: this.datePrevu,
      date_recu: this.dateRecu,
      montant: this.montantEcheance,
      commentaire: this.noteEcheance,
      id_paiement: this.moyen,
    }
    this.docService.payerEcheance(this.currentItem.id, item).subscribe(
      (res) => {
        console.log(res);
        Report.success('Notiflix Success', res.message, 'Okay',);
        this.viderchampsEcheance();
        this.listeEcheanceFacture();
        this.listePaiementFacture();
        this.listeFacture();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  viderchampsEcheance() {
    this.datePrevu = '';
    this.dateRecu = '';
    this.montantEcheance = '';
    this.noteEcheance = '';
    this.moyen = '';
  }

  // liste payment reçu par facture
  id_paiement:any;
  tabPaiementFacture: any[] = []
  listePaiementFacture() {
    this.docService.paymentRecuParFacture(this.currentIdFacture).subscribe(
      (paiements) => {
        this.tabPaiementFacture = paiements.paiements_recus;
        this.id_paiement = paiements.paiements_recus.id;
        console.log(this.tabPaiementFacture);
      },
      (err) => {
        console.log(err);
      }
    )
  }


  paymentRecuEnecheance(paramPayment: any) {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous transformer ce payment reçu en échèance?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.PaiementEnEcheance(paramPayment).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeEcheanceFacture();
            this.listePaiementFacture();
            Loading.remove()
          }
        )
      });
  }


  recalculerPrix(i: number) {
    // Récupérer l'article correspondant à l'index i
    const article = this.article[i];

    // Recalculer le prix total HT de l'article
    article.prix_total_ht_article = article.quantite_article * article.prix_unitaire_article;

    // Calculer le montant de la remise
    const montantRemise = article.prix_total_ht_article * (article.remise / 100);

    // Calculer le montant de la TVA
    const montantTVA = (article.prix_total_ht_article - montantRemise) * (article.TVA / 100);

    // Calculer le prix total TTC de l'article
    article.prix_total_tva_article = article.prix_total_ht_article - montantRemise + montantTVA;

    // Recalculer le prix total HT de la facture
    this.detailFacture.prix_HT = this.article.reduce((total: number, art: { prix_total_ht_article: number }) => total + art.prix_total_ht_article, 0);

    // Recalculer le prix total TTC de la facture
    this.detailFacture.prix_TTC = this.detailFacture.prix_HT + this.detailFacture.montant_tva;
  }

  initializeData() {
    // Exemple : initialiser le commentaire
    this.commentaireSolde = `Solde en faveur créé à partir de la note de crédit du ${this.currentDate}`;
    this.montantSolde = `${this.detailFacture?.prix_TTC}`;
  }

  clientSolde: any;
  montantSolde: any;
  dateSolde: any;
  commentaireSolde: any;
  createSolde() {
    let solde = {
      id_client: this.selectedClient,
      id_paiement: this.moyenPayement,
      montant: this.montantSolde,
      date_paiement: this.dateSolde,
      commentaire: this.commentaireSolde
    }
    this.docService.createSolde(this.selectedClient, solde).subscribe(
      (res) => {
        console.log(res);
        this.clientSolde = '';
        this.montantSolde = '';
        this.dateSolde = '';
        this.commentaireSolde = '';
        Report.success('Notiflix Success', res.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  date: string = '';
  createFactureAvoir() {
    let factureAvoir =
    {
      "num_facture": this.nextNumber,
      "active_Stock": this.active,
      "client_id": this.selectedClient,
      "facture_id": this.currentIdFacture,
      "titre_description": this.titre,
      "commentaire": this.commentaire,
      "prix_HT": this.detailFacture.prix_HT,
      "prix_TTC": this.detailFacture.prix_TTC,
      "date": this.date,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number

      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }

    for (let i = 0; i < this.article.length; i++) {
      let row = this.article[i];
      factureAvoir.articles.push({
        "id_article": row.id_article,
        "quantite_article": row.quantite_article,
        "prix_unitaire_article": row.prix_unitaire_article,
        "TVA_article": row.TVA,
        "reduction_article": row.reduction_article,
        "prix_total_article": row.prix_total_article,
        "prix_total_tva_article": row.prix_total_tva_article,
      });
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      factureAvoir.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createFactureAvoir(factureAvoir).subscribe(
      (res) => {
        console.log(res);
        Report.success('Notiflix Success', res.message, 'Okay',);
      }
    )
  }

  supprimerFactureAvoir(idFacture: any) {
    console.log(idFacture);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette facture?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteFactureAvoir(idFacture).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeFactureAvoir();
            Loading.remove()
          }
        )
      });
  }


  tabFactureRecurrente: any[] = []
  periode: string = '';
  durePeriode: string = '';
  brouillon: string = '';
  createFactureRecurrente() {
    alert(this.brouillon)
    let factureReccurente =
    {
      "num_facture": this.nextNumber,
      "active_Stock": this.active,
      "client_id": this.selectedClient,
      "note_interne": this.note,
      "nombre_periode": this.periode,
      "periode": this.durePeriode,
      "date_debut": this.date,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "type_reccurente": this.brouillon,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      factureReccurente.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      factureReccurente.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createFactureRecurrente(factureReccurente).subscribe(
      (res) => {
        console.log(res);
        Report.success('Notiflix Success', res.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  // liste facture recurrente
  listeFactureRecurrente() {
    this.docService.getAllFactureRecurrente().subscribe(
      (recurrente) => {
        this.tabFactureRecurrente = recurrente;
      },
      (err) => {
        console.log(err);
      }
    )
  }



  tabDevis: any[] = [];
  createDevis() {
    let devis =
    {
      "num_facture": this.nextNumberDevis,
      "client_id": this.selectedClient,
      "note_devi": 'test',
      "reduction_devi": this.remise,
      "date_devi": this.datedevis,
      "date_limite": this.datevaliditeDevis,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "echeances": [] as Array<{
        date_pay_echeance: string,
        montant_echeance: number,
      }>,
      "facture_accompts": [] as Array<{
        titreAccomp: string;
        dateAccompt: string;
        dateEcheance: string;
        montant: number,
        commentaire: string;
        num_facture: string;
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      devis.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    for (let i = 0; i < this.input.length; i++) {
      const item = this.input[i];
      devis.echeances.push({
        date_pay_echeance: item.date,
        montant_echeance: item.prix,
      });
    }

    for (let i = 0; i < this.tabAcompte.length; i++) {
      const item = this.tabAcompte[i];
      console.warn(item.num_facture)
      devis.facture_accompts.push({
        titreAccomp: item.titreAccomp,
        dateAccompt: item.dateAccompt,
        dateEcheance: item.dateEcheance,
        montant: item.montant,
        commentaire: item.commentaire,
        num_facture: item.num_facture
      });
      console.log(devis.facture_accompts);
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      devis.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createDevis(devis).subscribe(
      (res) => {
        console.log(res);
        Report.success('Notiflix Success', res.message, 'Okay',);
        this.listeDevis();
      },
      (err) => {
        console.log(err);
      }
    )

  }

  listeDevis() {
    this.docService.getAllDevis().subscribe(
      (devis) => {
        this.tabDevis = devis.devis;
        this.tabFactureFilter = this.tabDevis;
        console.log(this.tabDevis);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  deletedevis(idDevis: any) {
    console.log(idDevis);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette devis?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteDevis(idDevis).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeFactureAvoir();
            Loading.remove()
          }
        )
      });
  }

  annulerDevis(idDevis: any) {
    this.docService.annulerDevis(idDevis).subscribe(
      (devis) => {
        console.log(devis);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  detailDevi: any;
  clientDevi: any;
  articleDevi: any;
  numDevi: any;
  devis_id: any;
  detailDevis(idDevis: any) {
    this.devis_id = idDevis
    this.docService.detailDevis(idDevis).subscribe(
      (devis) => {
        this.detailDevi = devis.devi_details
        this.clientDevi = this.detailDevi.client
        this.articleDevi = this.detailDevi.articles
        this.numDevi = this.detailDevi.numero_devi
        console.log(this.detailDevi)
        console.log(this.articleDevi);

      },
      (err) => {
        console.log(err);
      }
    )
  }

  devisEnVente(idDevis: any) {
    console.log(idDevis);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous transformer cette devis en vente(facture)?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.transformerDevisEnFacture(idDevis).subscribe(
          (response) => {
            Notify.success(response.message);
            this.transformerEnFacture();
            this.ouvrirModalFacture();
            Loading.remove()
          }
        )
      });
  }

  devisEnCommande(idDevis: any) {
    console.log(idDevis);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous transformer cette devis en Commande?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.transformerDevisEnCommande(idDevis).subscribe(
          (response) => {
            Notify.success(response.message);
            this.transfromerEnCommande();
            this.ouvrirModalCommande();
            Loading.remove()
          }
        )
      });
  }

  ouvrirModalFacture() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('facture');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  ouvrirModalCommande() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('bonCommande');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }


  transformerEnFacture() {
    // Préparation des données pour la facture
    this.titre = `Facture basée sur le devis ${this.detailDevi.numero_devi}`;
    this.selectedClient = this.clientDevi.id_client;
    this.rows = this.articleDevi.map((article: any) => ({
      selectedProduct: article.id_article,
      quantity: article.quantite_article,
      unitPrice: article.prix_unitaire_article,
      tva: article.tva,
      total: article.prix_total_tva_article,
      totalTTC: article.prix_total_article
      // Ajoutez d'autres propriétés si nécessaire
    }));
    this.total = this.detailDevi.prix_TTC;
    this.totalTTC = this.detailDevi.prix_TTC;
    this.totalRemise = this.detailDevi.prix_TTC
    this.noteFacture = `Facture basée sur le devis ${this.detailDevi.numero_devi} du ${this.detailDevi.date_creation}`;


    // Mettre à jour la vue
    this.showStep(2);
  }

  transfromerEnCommande() {
    // Préparation des données pour la facture
    this.titre = `Commande basée sur le devis ${this.detailDevi.numero_devi}`;
    this.selectedClient = this.clientDevi.id_client;
    this.rows = this.articleDevi.map((article: any) => ({
      selectedProduct: article.id_article,
      quantity: article.quantite_article,
      unitPrice: article.prix_unitaire_article,
      tva: article.tva,
      total: article.prix_total_tva_article,
      totalTTC: article.prix_total_article
      // Ajoutez d'autres propriétés si nécessaire
    }));
    this.total = this.detailDevi.prix_TTC;
    this.totalTTC = this.detailDevi.prix_TTC;
    this.totalRemise = this.detailDevi.prix_TTC
    this.noteFacture = `Commande basée sur le devis ${this.detailDevi.numero_devi} du ${this.detailDevi.date_creation}`;


    // Mettre à jour la vue
    this.showStep(2);
  }



  createBonCommande() {
    let BonCommande =
    {
      "active_Stock": this.active,
      "client_id": this.selectedClient,
      "note_commande": this.noteFacture,
      "reduction_commande": this.remise,
      "date_commande": this.datedevis,
      "date_limite_commande": this.datevaliditeDevis,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "echeances": [] as Array<{
        date_pay_echeance: string,
        montant_echeance: number,
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      BonCommande.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }

    // Ajouter des échéances à la facture
    for (let i = 0; i < this.input.length; i++) {
      const item = this.input[i];
      alert(item.date)
      alert(item.prix)
      BonCommande.echeances.push({
        date_pay_echeance: item.date,
        montant_echeance: item.prix,
      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      BonCommande.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createBonCommande(BonCommande).subscribe(
      (res) => {
        console.log(res.message);
        Report.success('Notiflix Success', res.message, 'Okay',);
        this.listeBonCommande();
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
        this.tabFactureFilter = this.tabBonCommande;
        console.log(this.tabBonCommande);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  deleteBonCommande(idCommande: any) {
    console.log(idCommande);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette Bon de commande?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteBonCommande(idCommande).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonCommande();
            Loading.remove()
          }
        )
      });
  }


  annulerBonCommande(idCommande: any) {
    console.log(idCommande);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous annuler cette Bon de commande?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.annulerBonCommande(idCommande).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonCommande();
            Loading.remove()
          }
        )
      });
  }

  bonCommande: any;
  clientCommande: any;
  articlesCommande: any;
  echeancesCommande: any;
  commande_id:any
  numCommande:any
  detailBonCommande(idCommande: any) {
   this.commande_id = idCommande;
    this.docService.detailBonCommande(idCommande).subscribe(
      (detailCommande) => {
        this.bonCommande = detailCommande.bonCommande_details;
        this.clientCommande = this.bonCommande.client;
        this.articlesCommande = this.bonCommande.articles;
        this.echeancesCommande = this.bonCommande.echeances;
        this.numCommande = this.bonCommande.numero_bonCommande;
        console.log(this.bonCommande);
        console.log(this.echeancesCommande.date_pay_echeance);
        console.log(this.articlesCommande);
        console.log(this.clientCommande)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  commandeEnVente(idCommande: any) {
    console.log(idCommande);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous transformer cette Bon de commande en vente(facture)?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.transformerCommandEnFacture(idCommande).subscribe(
          (response) => {
            Notify.success(response.message);
            this.transformerCommandeEnVente();
            this.ouvrirModalFacture();
            Loading.remove()
          }
        )
      });
  }


  transformerCommandeEnVente() {
    // Préparation des données pour la facture
    this.titre = `Facture basée sur le Bon de commande ${this.bonCommande.numero_bonCommande}`;
    this.selectedClient = this.clientCommande.id;
    this.rows = this.articlesCommande.map((article: any) => ({
      selectedProduct: article.id_article,
      quantity: article.quantite_article,
      unitPrice: article.prix_unitaire_article,
      tva: article.tva,
      total: article.prix_total_tva_article,
      totalTTC: article.prix_total_article
      // Ajoutez d'autres propriétés si nécessaire
    }));
    this.total = this.bonCommande.prix_TTC;
    this.totalTTC = this.bonCommande.prix_TTC;
    this.totalRemise = this.bonCommande.prix_TTC
    this.noteFacture = `Facture basée sur le bon de commande ${this.bonCommande.numero_bonCommande}`;


    // Mettre à jour la vue
    this.showStep(2);
  }

  createBonLivraison() {
    let BonLivraison =
    {
      "active_Stock": this.active,
      "client_id": this.selectedClient,
      "note_livraison": this.noteFacture,
      "reduction_livraison": this.remise,
      "date_livraison": this.datedevis,
      // "fournisseur_id": this.datevaliditeDevis,
      "prix_HT": this.total,
      "prix_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      BonLivraison.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      BonLivraison.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createBonLivraison(BonLivraison).subscribe(
      (response) => {
        Report.success('Notiflix Success', response.message, 'Okay',);
        this.listeBonLivraison();
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
        this.tabFactureFilter = this.tabLivraison
      },
      (err) => {
        console.log(err);
      }
    )
  }

  detailBonLivraison: any;
  cientBonLivraison: any;
  articlesLivraison: any;
  livraison_id:any;
  num_livraison:any;
  detailLivraison(idLivraison: any) {
    this.livraison_id = idLivraison;
    this.docService.detailBonLivraison(idLivraison).subscribe(
      (detailLivraison) => {
        this.detailBonLivraison = detailLivraison.bonCommande_details;
        this.cientBonLivraison = this.detailBonLivraison.client;
        this.articlesLivraison = this.detailBonLivraison.articles;
        this.num_livraison = detailLivraison.numero_livraison;
        console.log(this.detailBonLivraison)
        console.log(this.cientBonLivraison)
        console.log(this.articlesLivraison)
      },
      (err) => {
        console.log(err);
      }
    )
  }


  deleteBonLivraison(idLivraison: any) {
    console.log(idLivraison);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette Bon de livraison?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteBonLivraison(idLivraison).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonLivraison();
            Loading.remove()
          }
        )
      });
  }

  preparerBonLivraison(idLivraison: any) {
    console.log(idLivraison);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous préparer cette Bon de livraison?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.livraisonEnPreparation(idLivraison).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonLivraison();
            Loading.remove()
          }
        )
      });
  }

  realiserBonLivraison(idLivraison: any) {
    console.log(idLivraison);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous réaliser cette Bon de livraison?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.livraisonRealiser(idLivraison).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonLivraison();
            Loading.remove()
          }
        )
      });
  }

  planifierBonLivraison(idLivraison: any) {
    console.log(idLivraison);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous planifier cette Bon de livraison?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.livraisonPlanifier(idLivraison).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeBonLivraison();
            Loading.remove()
          }
        )
      });
  }

  transformerLivraisonEnVente() {
    // Préparation des données pour la facture
    this.titre = `Facture basée sur le Bon de livraison ${this.detailBonLivraison.numero_livraison}`;
    this.selectedClient = this.cientBonLivraison.id;
    this.rows = this.articlesLivraison.map((article: any) => ({
      selectedProduct: article.id_article,
      quantity: article.quantite_article,
      unitPrice: article.prix_unitaire_article,
      tva: article.tva,
      total: article.prix_total_tva_article,
      totalTTC: article.prix_total_article
      // Ajoutez d'autres propriétés si nécessaire
    }));
    this.total = this.detailBonLivraison.prix_TTC;
    this.totalTTC = this.detailBonLivraison.prix_TTC;
    this.totalRemise = this.detailBonLivraison.prix_TTC
    this.noteFacture = `Facture basée sur le bon de livraison ${this.detailBonLivraison.numero_livraison}`;


    // Mettre à jour la vue
    this.showStep(2);
  }

  ouvrirModalLivraison() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('livraison');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  livraisonEnVente(idLivraison: any) {
    console.log(idLivraison);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous transformer cette devis en Commande?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.transformerLivraisonEnFacture(idLivraison).subscribe(
          (response) => {
            Notify.success(response.message);
            this.transformerLivraisonEnVente();
            this.ouvrirModalFacture();
            Loading.remove()
          }
        )
      });
  }

  isPreview: boolean = false;

  togglePreviewMode() {
    this.isPreview = !this.isPreview;
  }


  generatePdf(divId: string) {
    const printSection = document.getElementById(divId);

    if (printSection) {
      html2canvas(printSection, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: null
      }).then(canvas => {
        if (canvas) {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });

          pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'myImage', 'FAST');
          pdf.save('facture.pdf');
        } else {
          console.error('Le canvas est vide.');
        }
      }).catch(error => {
        console.error('Erreur lors de la génération du PDF:', error);
      });
    } else {
      console.error(`${divId} est null`);
    }
  }


  // Variables si les champs sont exacts
  exactClient: boolean = false;
  exactData: boolean = false;

  // validation des formulaires
  // client
  verifClientFonction() {
    this.exactClient = false;
    if (this.selectedClient == "") {

    }
    else {
      this.exactClient = true;
    }
  }

  // produit
  verifProduitFonction(row: any) {
    this.exactData = false;
    if (row.quantity == "" && row.selectedProduct == "" && row.reductionArticle) {

    }
    else {
      this.exactData = true;
    }
  }

  // Initialiser le contenu actuel
  currentStep: number = 1;


  showStep(step: number) {
    this.currentStep = step;
  }


  input: any[] = [
    { date: '', prix: 0 }
  ];

  addInput(): void {
    this.input.push({ date: '', prix: 0 });
  }

  deleteInput(index: number): void {
    this.input.splice(index, 1);
  }
  viderchamps() {
    this.input = [
      { date: '', prix: 0 }
    ];
    this.rows = [];
    this.acompte = "";
    this.dateDebut = "";
    this.dateFin = "";
    this.montantAcompte = "";
    this.commentaire = "";
    this.totalHT = 0;
    this.totalTTC = 0;
    this.typePaiement = "";
  }



  // Attribut pour la pagination
  itemsParPage = 3; // Nombre d'articles par page
  pageActuelle = 1; // Page actuelle

  // chager la valeur du nombre de resulat par page
  changeValue() {
    this.itemsParPage = this.itemsParPage;
  }

  // Pagination 
  // Méthode pour déterminer les articles à afficher sur la page actuelle
  getItemsPage(): any[] {
    const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
    const indexFin = indexDebut + this.itemsParPage;
    return this.tabFactureFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
  }

  //exporter devis
  exportDeviExcel() {
    this.docService.exportDevisToExcel().subscribe(
      (data: Blob) => {
        data.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Augmenter la largeur des colonnes
          if (worksheet['!ref']) {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const cols: XLSX.ColInfo[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              cols.push({ wch: 20 }); // Définir la largeur à 15
            }
            worksheet['!cols'] = cols;
          }

          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exportDevis.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //exporter  bon de commande
  exportBonCommandeExcel() {
    this.docService.exportBonCommandeToExcel().subscribe(
      (data: Blob) => {
        data.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Augmenter la largeur des colonnes
          if (worksheet['!ref']) {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const cols: XLSX.ColInfo[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              cols.push({ wch: 20 }); // Définir la largeur à 15
            }
            worksheet['!cols'] = cols;
          }

          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exportBonCommande.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //exporter  bon de livraison
  exportBonLivraisonExcel() {
    this.docService.exportBonLivraisonToExcel().subscribe(
      (data: Blob) => {
        data.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Augmenter la largeur des colonnes
          if (worksheet['!ref']) {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const cols: XLSX.ColInfo[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              cols.push({ wch: 20 }); // Définir la largeur à 15
            }
            worksheet['!cols'] = cols;
          }

          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exportBonLivraison.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //exporter  depense
  exportDepenseExcel() {
    this.docService.exportBonLivraisonToExcel().subscribe(
      (data: Blob) => {
        data.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Augmenter la largeur des colonnes
          if (worksheet['!ref']) {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const cols: XLSX.ColInfo[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              cols.push({ wch: 20 }); // Définir la largeur à 15
            }
            worksheet['!cols'] = cols;
          }

          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exportDepenses.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  couleurs: string[] = ['#FFEB3B', '#CDDC39', '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#00BCD4', '#8BC34A'];
  etiquette: Etiquette = { nom_etiquette: '', code_etiquette: '' };
  tabEtiquette: Etiquette[] = [];
  selectedEtiquettes: Etiquette[] = [];
  modeEdition = false;
  addNewEtiquette: boolean = false;


  choisirEtiquette(etiq: Etiquette) {
    const index = this.selectedEtiquettes.indexOf(etiq);
    console.error(this.selectedEtiquettes)
    if (index === -1) {
      this.selectedEtiquettes.push(etiq);  // Ajouter si non sélectionnée
    } else {
      this.selectedEtiquettes.splice(index, 1);  // Retirer si déjà sélectionnée
    }
    this.updateSelectedEtiquetteIds();
  }

  supprimerEtiquettechosi(index: number) {
    this.selectedEtiquettes.splice(index, 1);
    this.updateSelectedEtiquetteIds();
  }

  selectedIds: any[] = []
  updateSelectedEtiquetteIds() {
    this.selectedIds = this.selectedEtiquettes.map(etiq => etiq.id);
    console.log('IDs des étiquettes sélectionnées:', this.selectedIds);
  }

  reinitialiserFormulaire() {
    this.etiquette = { nom_etiquette: '', code_etiquette: '' };
    this.modeEdition = false;
  }

  newEtiquette() {
    this.addNewEtiquette = true;
    this.etiquette = { nom_etiquette: '', code_etiquette: '' };
  }

  annulerAjout() {
    this.addNewEtiquette = false;
    this.etiquette = { nom_etiquette: '', code_etiquette: '' };
  }

  annulerModification() {
    this.modeEdition = false;
    this.etiquette = { nom_etiquette: '', code_etiquette: '' };
  }

  selectionnerCouleur(couleur: string) {
    this.etiquette.code_etiquette = couleur;
  }

  ajouterEtiquette() {
    if (this.etiquette.nom_etiquette && this.etiquette.code_etiquette) {
      this.etiquetteService.addEtiquette(this.etiquette).subscribe(
        (response) => {
          console.log('Étiquette ajoutée:', response);
          this.listeEtiquette();
          this.addNewEtiquette = false;
          this.etiquette = { nom_etiquette: '', code_etiquette: '' };
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'étiquette:', error);
        }
      );
    }
  }

  editerEtiquette(etiq: Etiquette) {
    this.modeEdition = true;
    this.etiquette = { ...etiq };
  }

  modifierEtiquette() {
    if (this.etiquette.id && this.etiquette.nom_etiquette && this.etiquette.code_etiquette) {
      this.etiquetteService.updateEtiquette(this.etiquette.id, this.etiquette).subscribe(
        (response) => {
          console.log('Étiquette modifiée:', response);
          this.listeEtiquette();
          this.modeEdition = false;
          this.etiquette = { nom_etiquette: '', code_etiquette: '' };
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'étiquette:', error);
        }
      );
    }
  }

  listeEtiquette() {
    this.etiquetteService.getAllEtiquette().subscribe(
      (reponse) => {
        this.tabEtiquette = reponse.etiquette;
        console.log('Liste des étiquettes:', this.tabEtiquette);
      },
      (error) => {
        console.error('Erreur lors de la récupération des étiquettes:', error);
      }
    );
  }



  supprimerEtiquette(id: any) {
    console.log(id)
    this.etiquetteService.deleteEtiquette(id).subscribe(
      (response) => {
        console.log('Étiquette supprimée:', response);
        this.listeEtiquette();
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'étiquette:', error);
      }
    );
  }
  ouvrirModalArticle() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  modalName = ''

  changeValueModal(value: string) {
    this.modalName = value;
  }

  ouvrirModal() {
    if (this.modalName == 'ajoutVente') {
      const modal = document.getElementById('facture');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutFactureAvoir') {
      const modal = document.getElementById('FactureAvoir');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutFactureRecurrente') {
      const modal = document.getElementById('FactureRecurrente');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutDevis') {
      const modal = document.getElementById('devis');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutBoncommande') {
      const modal = document.getElementById('bonCommande');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutBonLivraison') {
      const modal = document.getElementById('livraison');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }
  }

  // liste model document
  isLoading: boolean = true;
  listeModel: any[] = [];
  listeModelByTypeDocument() {
    this.filterService.getModelByTypeDocument(this.typeDocument).subscribe(
      (response) => {
        this.listeModel = response.modelesDocuments;
        console.log(this.listeModel);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        console.log(this.isLoading)
      }
    )
  }

  docId: any;
  modelId: any;
  recupIdDocument(idDocs: any) {
    this.docId = idDocs;
  }

  recupIdModel(idModel: any) {
    this.modelId = idModel;
    this.downloadPDF();
  }

  recupIdModelEmail(idModel: any) {
    this.modelId = idModel;
    alert(this.modelId);
    this.emailDoc();
  }

resumeVente: string='';

setValueResume(value:string){
  this.resumeVente = value;
}

  // generer pdf facture 
  downloadPDF() {
    let urlPdf: any;
    let nomPdf: any;
    if (this.typeDocument == 'vente') {
      urlPdf = `http://127.0.0.1:8000/api/genererPDFFacture/${this.docId}/${this.modelId}`;
      nomPdf = `facture_${this.currentNumFacture}.pdf`;
    } else if (this.typeDocument == 'devi') {
      urlPdf = `http://127.0.0.1:8000/api/genererPDFDevis/${this.devis_id}/${this.modelId}`;
      nomPdf = `devi${this.numDevi}.pdf`;
    } else if (this.typeDocument == 'command_vente') {
      urlPdf = `http://127.0.0.1:8000/api/genererPDFBonCommande/${this.commande_id}/${this.modelId}`;
      nomPdf = `commande_vente${this.numCommande}.pdf`;
    } else if (this.typeDocument == 'livraison') {
      urlPdf = `http://127.0.0.1:8000/api/genererPDFLivraison/${this.livraison_id}/${this.modelId}`;
      nomPdf = `livraison${this.num_livraison}.pdf`;
    }

    this.http.post(urlPdf, '', {
      responseType: 'blob',
      observe: 'response'
    }).subscribe(response => {
      // Vérifier si response.body n'est pas null
      if (response.body) {
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = nomPdf;
        link.click();

        window.URL.revokeObjectURL(url);
      } else {
        console.error('Le contenu du PDF est vide');
        // Vous pouvez ajouter ici un message d'erreur pour l'utilisateur
      }
    }, error => {
      console.error('Erreur lors du téléchargement du PDF:', error);
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    });
  }


  detailEmail: any;
  // detail email facture
  emailDoc() {
    let urlPdf: any;
    if (this.typeDocument == 'vente') {
      urlPdf = `http://127.0.0.1:8000/api/DetailEmailFacture_genererPDF/${this.docId}/${this.modelId}`;
      if(this.currentDetail == 'Réglements'){
        urlPdf = `http://127.0.0.1:8000/api/DetailEmailPaiementRecu_genererPDF/${this.id_paiement}/${this.modelId}`;
        if(this.resumeVente == 'resume'){
          urlPdf = `http://127.0.0.1:8000/api/DetailEmailResumeVente_genererPDF/${this.docId}/${this.modelId}`;
        }
      }
    } else if (this.typeDocument == 'devi') {
      urlPdf = `http://127.0.0.1:8000/api/DetailEmailDevi_genererPDF/${this.devis_id}/${this.modelId}`;
    } else if (this.typeDocument == 'command_vente') {
      urlPdf = `http://127.0.0.1:8000/api/DetailEmailBonCommande_genererPDF/${this.commande_id}/${this.modelId}`;
    } else if (this.typeDocument == 'livraison') {
      urlPdf = `http://127.0.0.1:8000/api/DetailEmailLivraison_genererPDF/${this.livraison_id}/${this.modelId}`;
    }

    this.http.post(urlPdf, '', {
    
    }).subscribe(response => {
      console.log(response)
      this.detailEmail = response;
    }, error => {
      console.error('Erreur lors du téléchargement du PDF:', error);
      
    })
  }


  // envoyer email facture
  envoiMail() {
    let urlPdf: any;
    if (this.typeDocument == 'vente') {
      urlPdf = `http://127.0.0.1:8000/api/envoyerEmailFacture/${this.docId}/${this.modelId}`;
      if(this.currentDetail == 'Réglements'){
        urlPdf = `http://127.0.0.1:8000/api/envoyerEmailResumeVente/${this.id_paiement}/${this.modelId}`;
      } if(this.resumeVente == 'resume'){
        urlPdf = `http://127.0.0.1:8000/api/envoyerEmailResumeVente/${this.docId}/${this.modelId}`;
      }
    } else if (this.typeDocument == 'devi') {
      urlPdf = `http://127.0.0.1:8000/api/envoyerEmailDevi/${this.devis_id}/${this.modelId}`;
    } else if (this.typeDocument == 'command_vente') {
      urlPdf = `http://127.0.0.1:8000/api/envoyerEmailPaiementRecu/${this.commande_id}/${this.modelId}`;
    } else if (this.typeDocument == 'livraison') {
      urlPdf = `http://127.0.0.1:8000/api/envoyerEmailLivraison/${this.livraison_id}/${this.modelId}`;
    }

    this.http.post(urlPdf, '', {}).subscribe(response => {
      console.log(response)
      Report.success('Notiflix Success', 'response', 'Okay',);
      this.resumeVente = '';
    }, error => {
      console.error('Erreur lors de l envoi du mail:', error);
      
    })
  }

  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = this.typeDocument;
    fileName = `${this.typeDocument}.xlsx`;
    this.itemsParPage = this.tabFactureFilter.length;

    try {

      setTimeout(() => {
        try {
          const element = document.getElementById(idTab);
          if (!element) {
            throw new Error(`Table avec l'id ${idTab} non trouvée`);
          }

          const cells = element.getElementsByTagName('td');
          Array.from(cells).forEach(cell => {
            const value = cell.textContent || '';
            if (/^0+\d+$/.test(value)) {
              cell.setAttribute('data-t', 's');
              cell.setAttribute('data-v', value);
            }
          });

          const options = {
            raw: false,
            rawNumbers: false,
            dateNF: 'dd/mm/yyyy',
            cellText: true,
            cellStyles: true,
            cellDates: true,
          };

          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, options);

          if (ws['!ref']) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let R = range.s.r; R <= range.e.r; ++R) {
              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const cell = ws[cellRef];

                if (cell && cell.v !== undefined) {
                  const value = String(cell.v);
                  if (/^0+\d+$/.test(value)) {
                    ws[cellRef] = {
                      t: 's',
                      v: value,
                      w: value,
                      s: {
                        numFmt: '@'
                      }
                    };
                  }
                }
              }
            }
          }

          ws['!types'] = {
            numFmt: '@'
          };

          if (ws['!ref']) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            const colWidths = [];

            for (let C = range.s.c; C <= range.e.c; ++C) {
              let maxWidth = 10;
              for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const cell = ws[cellRef];
                if (cell && cell.v) {
                  maxWidth = Math.max(maxWidth, String(cell.v).length + 2);
                }
              }
              colWidths.push({ wch: maxWidth });
            }
            ws['!cols'] = colWidths;
          }

          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          if (!fileName) {
            fileName = 'export.xlsx';
          }

          const wopts: XLSX.WritingOptions = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary',  // Correctly set to 'binary'
            cellStyles: true,  // Retaining this if you need styles
          };


          XLSX.writeFile(wb, fileName, wopts);

        } catch (error) {
          console.error('Erreur lors de l\'export Excel:', error);
        }
      }, 200);

    } catch (error) {
      console.error('Erreur lors de la configuration de l\'export:', error);
    } finally {
      setTimeout(() => {
        this.pageActuelle = originalPage;
        this.itemsParPage = originalItemsPerPage;
      }, 300);
    }
  }

}
