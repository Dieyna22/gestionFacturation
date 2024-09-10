import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { ClientsService } from 'src/app/services/clients.service';
import { CommandeDachatService } from 'src/app/services/commande-dachat.service';
import { GrilleTarifaireService } from 'src/app/services/grille-tarifaire.service';
import { PayementService } from 'src/app/services/payement.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { VenteService } from 'src/app/services/vente.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-commande-dachat',
  templateUrl: './commande-dachat.component.html',
  styleUrls: ['./commande-dachat.component.css']
})
export class CommandeDachatComponent {
  constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private articleService: ArticlesService, private clientService: ClientsService, private userService: UtilisateurService, private productService: ArticlesService, private renderer: Renderer2, private payementService: PayementService, private grilleservice: GrilleTarifaireService, private docService: VenteService, private commandeAchatService: CommandeDachatService) {
    // this.currentDate = this.getCurrentDate();
  }

  tabCommandeDachat: any[] = [];
  tabCommandeDachatFilter: any[] = [];
  tabGrille: any[] = [];
  selectedClient: any;

  dateCommande: string = "";
  dateLivraison: string = "";
  noteInterne: string = "";
  commentaire: string = "";
  active: boolean = false;
  categorie: string = '';
  note: string = '';
  datePay: string = '';
  montantPay: number = 0;
  montantPayTtc: number = 0;
  tva: number = 0;
  moyenPayement: string = "";
  numero: string = '';
  dateFacture: string = '';
  impayer: string = 'impayer';



  selectedPrefix: string = '';
  customPrefix: string = '';
  nextNumber: string = '000000';
  nextNumberDepense: string = '000000';
  baseNumber: string = '000000';
  prefix: string = '';
  updateNum: string = '';
  numerotation: string = '';


  totalHT: number = 0;
  totalTVA: number = 0;


  ngOnInit() {
    this.listeArticles();
    this.listePayement();
    this.listeNumber();
    this.listeCommandeDachat();
  }

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

  // Variables si les champs sont exacts
  exactClient: boolean = false;
  exactData: boolean = false;
  // produit
  verifProduitFonction(row: any) {
    this.exactData = false;
    if (row.quantity == "" && row.selectedProduct == "" && row.reductionArticle) {

    }
    else {
      this.exactData = true;
    }
  }
  isPreview: boolean = false;

  togglePreviewMode() {
    this.isPreview = !this.isPreview;
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

  setTypeActive(type: boolean) {
    this.active = type;
  }

  tabCategorie: any[] = [];
  listeCategorieDepense() {
    this.docService.getAllCategorieDepense().subscribe(
      (response) => {
        this.tabCategorie = response.CategorieDepense;
        console.log('Liste des catégories de dépenses : ', response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories de dépenses : ', error);
      }
    );
  }

  showTva: boolean = false;
  showInputTva() {
    this.showTva = !this.showTva;
  }

  calculerMontantTtc() {
    if (this.tva !== null && this.montantPay !== null) {
      const tauxTVA = 1 + (this.tva / 100);
      this.montantPayTtc = this.montantPay * tauxTVA;
      // Arrondir à deux décimales
      this.montantPayTtc = Math.round(this.montantPayTtc * 100) / 100;
    } else {
      this.montantPayTtc = 0;
    }
  }

  setTypeImpay(type: string) {
    this.impayer = type;
  }

  infosFacture: boolean = false;
  showInfosFacture() {
    this.infosFacture = !this.infosFacture;
  }

  tabPayement: any[] = [];
  listePayement() {
    this.payementService.getAllPayement().subscribe(
      (paye: any) => {
        this.tabPayement = paye;
        console.log(this.tabPayement);
      },
      (err) => {
      }
    )
  }

  filterValue: string = "";
  onSearch() {
    // Recherche se fait selon le nom ou le prenom 
    this.tabCommandeDachatFilter = this.tabCommandeDachat.filter(
      (elt: any) => (elt?.nom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.type_paiement.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.num_fact.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom_client.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
  }
  currentNumConfig: string = 'sansPrefixes';
  showNumConfig(configId: string) {
    this.currentNumConfig = configId
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
  }

  configurationNumero() {
    let numFacture =
    {
      type_document: 'commande_achat',
      type_numerotation: this.numerotation,
      prefixe: this.customPrefix,
      format: this.selectedPrefix,
    }

    this.docService.configNumero(numFacture).subscribe(
      (response) => {
        console.log('Configuration numero : ', response);
        this.ouvrirModalCommandeAchat();
      },
      (error) => {
        console.error('Erreur lors de la configuration du numérotation : ', error);
      }
    )
  }

  ouvrirModalCommandeAchat() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('commandeDachat');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  formatFinal: any
  tabNum: any[] = [];
  numComplet: any
  listeNumber() {
    const now = new Date();
    this.commandeAchatService.getAllNumeroCommandeDachat().subscribe(
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
              datePart = now.getFullYear().toString();
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

  createCommandeDachat() {
    let CommandeDachat =
    {
      "active_Stock": this.active,
      "num_commandeAchat": this.nextNumber,
      "note_interne": this.noteInterne,
      "commentaire": this.commentaire,
      "reduction_commande": this.remise,
      "date_commandeAchat": this.dateCommande,
      "date_livraison": this.dateLivraison,
      "total_TTC": this.totalRemise,
      "articles": [] as Array<{
        id_article: number;
        quantite_article: number;
        prix_unitaire_article: number;
        TVA_article: number,
        reduction_article: number;
        prix_total_article: number,
        prix_total_tva_article: number
      }>
    }
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];
      CommandeDachat.articles.push({
        "id_article": row.selectedProduct,
        "quantite_article": row.quantity,
        "prix_unitaire_article": row.promotionalPrice ? row.promotionalPrice : (row.tabGrille ? row.tabGrille : row.unitPrice),
        "TVA_article": row.tva,
        "reduction_article": row.reductionArticle,
        "prix_total_article": row.total,
        "prix_total_tva_article": row.totalTTC,
      });
    }
    console.log(CommandeDachat);

    this.commandeAchatService.addCommandeDachat(CommandeDachat).subscribe(
      (res) => {
        console.log(res.message);
        Report.success('Notiflix Success', res.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  listeCommandeDachat() {
    this.commandeAchatService.getAllCommandeDachat().subscribe(
      (response) => {
        console.warn(response);
        this.tabCommandeDachat = response.CommandeAchats;
        this.tabCommandeDachatFilter = this.tabCommandeDachat;
        console.log(this.tabCommandeDachatFilter);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  deleteCommandeDachat(idCommandeDachat: any) {
    console.log(idCommandeDachat);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette commande d\'achat?',
      'Oui', 'Non', () => {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.commandeAchatService.deleteCommandeDachat(idCommandeDachat).subscribe(
        (response) => {
          Notify.success(response.message);
          this.listeCommandeDachat();
          Loading.remove()
        }
      )
    });
  }

  detailCommandeDachat(idCommandeDachat: any) {
    this.commandeAchatService.DetailCommandeDachat(idCommandeDachat).subscribe(
      (response) => {
       console.log(response)
      }
    )
  }

  // Attribut pour la pagination
  itemsParPage = 3; // Nombre d'articles par page
  pageActuelle = 1; // Page actuelle

  // Pagination 
  // Méthode pour déterminer les articles à afficher sur la page actuelle
  getItemsPage(): any[] {
    const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
    const indexFin = indexDebut + this.itemsParPage;
    return this.tabCommandeDachatFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabCommandeDachatFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabCommandeDachatFilter.length / this.itemsParPage);
  }
}
