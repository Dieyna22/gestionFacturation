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
import { EtiquetteService } from 'src/app/services/etiquette.service';
import * as XLSX from 'xlsx';
import { ConfigurationService } from 'src/app/services/configuration.service';

interface Etiquette {
  id?: number;
  nom_etiquette: string;
  code_etiquette: string;
}

@Component({
  selector: 'app-commande-dachat',
  templateUrl: './commande-dachat.component.html',
  styleUrls: ['./commande-dachat.component.css']
})
export class CommandeDachatComponent {
  constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private articleService: ArticlesService, private clientService: ClientsService, private userService: UtilisateurService, private productService: ArticlesService, private renderer: Renderer2, private payementService: PayementService, private grilleservice: GrilleTarifaireService, private docService: VenteService, private commandeAchatService: CommandeDachatService, private etiquetteService: EtiquetteService,private filterService: ConfigurationService) {
    // this.currentDate = this.getCurrentDate()
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
  idFournisseur: string = '';


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

  dbUsers: any;
  idUserConnect: any;

  actif = 1
  filterliste:any[]=[];
  filterCommandeDachat(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabCommandeDachat, filterTerm, ['statut','active_Stock']);
    if(this.filterliste.length==0){
      this.listeCommandeDachat();
    }else{
      this.tabCommandeDachatFilter = this.filterliste;
    } 
  }

  ngOnInit() {
    this.listeArticles();
    this.listePayement();
    this.listeNumber();
    this.listeNumberDepense();
    this.listeCommandeDachat();
    this.listeEtiquette();
    this.listeCategorieDepense();
    this.listeFournisseur();
    this.listeDepense();
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.idUserConnect = this.dbUsers.user.id;
    console.log('id user connect:', this.idUserConnect);
  }

  rows: any[] = [
    { selectedProduct: '', quantity: 0, unitPrice: 0, reductionArticle: 0, tva: 0, total: 0, totalTTC: 0 }
  ];

  addRow(): void {
    this.rows.push({ selectedProduct: '', quantity: 0, unitPrice: 0, reductionArticle: 0, tva: 0, total: 0, totalTTC: 0 });
    this.updateAllCalculations();
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
    this.calculateGrandTotal();
    this.calculateGrandTotalAvecRemise();
    this.calculateTVA();
    this.calculateGrandTotalTTC();
    this.updateAllCalculations();
  }

  prixHt: any;
  calculateTotal(row: any): void {
    row.total = row.quantity * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixHt = row.total;
    this.calculateGrandTotal();
  }

  prixTTC: any;
  totalTTC: number = 0;
  tvaCommande: any
  calculateTotalTva(row: any): void {
    row.totalTTC = row.quantity * (1 + row.tva / 100) * (row.promotionalPrice || row.grillePrice || row.price || row.unitPrice) - row.reductionArticle;
    this.prixTTC = row.totalTTC;
    this.tvaCommande = row.tva;
    this.calculateTVA();
  }


  total: number = 0;

  calculateGrandTotal(): void {
    console.log(this.rows)
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
  }

  updateAllCalculations(): void {
    // Réinitialiser tous les totaux
    this.total = 0;
    this.totalTTC = 0;
    this.totalTVA = 0;

    // Recalculer pour chaque ligne
    this.rows.forEach(row => {
      // Calculer le prix unitaire effectif
      const prixUnitaire = row.promotionalPrice || row.grillePrice || row.price || row.unitPrice || 0;

      // Calculer le total HT pour cette ligne
      row.total = (row.quantity * prixUnitaire) - (row.reductionArticle || 0);

      // Calculer le total TTC pour cette ligne
      row.totalTTC = row.total * (1 + (row.tva || 0) / 100);

      // Ajouter au total global
      this.total += row.total;
      this.totalTTC += row.totalTTC;
      this.totalTVA += row.totalTTC - row.total;
    });

    // Arrondir les résultats à deux décimales
    this.total = Math.round((this.total + Number.EPSILON) * 100) / 100;
    this.totalTTC = Math.round((this.totalTTC + Number.EPSILON) * 100) / 100;
    this.totalTVA = Math.round((this.totalTVA + Number.EPSILON) * 100) / 100;

    // Calculer le total avec remise
    this.totalRemise = this.totalTTC - (this.remise || 0);
    this.totalRemise = Math.round((this.totalRemise + Number.EPSILON) * 100) / 100;
  }

  onInputChange(): void {
    this.updateAllCalculations();
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
    console.error(this.currentProduct);
    row.unitPrice = this.currentProduct[0].prix_unitaire;
    console.log(row.unitPrice)
    row.promotionalPrice = this.currentProduct[0].prix_promo;
    this.productSelected = this.currentProduct[0].nom_article;
    this.updateAllCalculations();
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

  listeNumberDepense() {
    const now = new Date();
    this.docService.getAllNumeroDepense().subscribe(
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
          this.nextNumberDepense = this.numComplet;

          console.log('Numéro complet : ', this.numComplet);
          console.log('Prochain numéro : ', this.nextNumberDepense);
        } else {
          console.error('Pas de configuration trouvée dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des numéros : ', error);
      }
    );
  }


  tabFournisseur: any[] = [];
  listeFournisseur() {
    this.docService.getAllFournisseur().subscribe(
      (response) => {
        this.tabFournisseur = response;
        console.log('Liste des fournisseurs : ', response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des fournisseurs : ', error);
      }
    );
  }

  currentFournisseur: any;
  idcurrentFournisseur: any
  onClientSelected() {
    this.currentFournisseur = this.tabFournisseur.filter((fournisseur: any) => fournisseur.id == this.idFournisseur);
    this.idcurrentFournisseur = this.idFournisseur
  }

  createDepense() {
    this.montantPay = this.totalRemise
    let depense =
    {
      "activation": this.active,
      "id_categorie_depense": this.categorie,
      "date_paiement": this.datePay,
      "commentaire": this.note,
      "tva_depense": this.tva,
      "montant_depense_ht": this.montantPay,
      "montant_depense_ttc": this.montantPayTtc,
      "num_facture": this.numero,
      "date_facture": this.dateFacture,
      "fournisseur_id": null,
      "statut_depense": this.impayer,
      "id_paiement": this.moyenPayement,
      "doc_externe": null,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      depense.etiquettes.push({
        id_etiquette: item,
      });
    }
    this.docService.createDepense(depense).subscribe(
      (response) => {
        console.log(response);
        Report.success('Notiflix Success', response.message, 'Okay',);
        this.listeDepense();
        this.filterRecentDepense();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabDepense: any[] = [];
  listeDepense() {
    this.docService.getAllDepense().subscribe(
      (response) => {
        this.tabDepense = response.depenses;
        console.log('Liste des dépenses : ', this.tabDepense);
        this.filterRecentDepense();
      },
      (error) => {
        console.error('Erreur lors de la récupération des dépenses : ', error);
      }
    );
  }

  recentDepenses: any;
  // Filtrer la dépense créée dans les 2 dernières minutes
  filterRecentDepense() {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);

    // Filtrer les dépenses des 2 dernières minutes et créées par l'utilisateur connecté
    const depensesRecentes = this.tabDepense.filter(depense => {
      const depenseDate = new Date(depense.date_creation);
      const isRecent = depenseDate >= twoMinutesAgo && depenseDate <= now;

      // Vérifier si la dépense a été créée par l'utilisateur connecté
      const isCreatedByUser = (depense.id_sous_utilisateur === null && depense.id_user === this.idUserConnect) ||
        (depense.id_sous_utilisateur === this.idUserConnect);

      return isRecent && isCreatedByUser;
    });

    // Si on a des dépenses récentes, on prend la plus récente
    if (depensesRecentes.length > 0) {
      // Trier par date décroissante et prendre la première
      this.recentDepenses = [depensesRecentes.reduce((plusRecente, depense) => {
        const dateA = new Date(plusRecente.date_creation);
        const dateB = new Date(depense.date_creation);
        return dateB > dateA ? depense : plusRecente;
      })];
    } else {
      this.recentDepenses = []; // Tableau vide si pas de dépenses récentes
    }

    console.log('Dépense la plus récente :', this.recentDepenses);
  }

  createCommandeDachat() {
    let CommandeDachat =
    {
      "active_Stock": this.active,
      "num_commandeAchat": this.nextNumber,
      "fournisseur_id": this.idFournisseur,
      "depense_id": this.recentDepenses[0].id,
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
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
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

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      CommandeDachat.etiquettes.push({
        id_etiquette: item,
      });
    }
    console.log(CommandeDachat);

    this.commandeAchatService.addCommandeDachat(CommandeDachat).subscribe(
      (res) => {
        console.log(res.message);
        Report.success('Notiflix Success', res.message, 'Okay',);
        this.listeCommandeDachat();
        this.resetCommandeDachat();
        this.recentDepenses = [];
        Loading.remove();
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

  currentCommandeDachat: any;
  articleCommandeDachat: any;
  isAssociatedWithDepense: boolean = false;
  chargerInfosCommandeDachat(paramCommandeDachat: any) {
    this.rows = [];
    this.currentCommandeDachat = paramCommandeDachat
    console.log(paramCommandeDachat);
    this.dateCommande = paramCommandeDachat.date_creation;
    this.dateLivraison = paramCommandeDachat.livraison;
    this.noteInterne = paramCommandeDachat.note_interne;
    this.commentaire = paramCommandeDachat.commentaire;
    this.nextNumber = paramCommandeDachat.num_CommandeAchat;
    this.idFournisseur = paramCommandeDachat.id_fournisseur
    this.selectedEtiquettes = paramCommandeDachat.etiquettes;
    this.active = paramCommandeDachat.active_Stock;
    this.total = paramCommandeDachat.prix_TTC;
    // this.totalRemise = paramCommandeDachat.prix_TTC;
    // this.totalTTC = paramCommandeDachat.prix_TTC;
    if (paramCommandeDachat.active_Stock = 1) {
      this.active = true
    } else if (paramCommandeDachat.active_Stock = 0) {
      this.active = false
    }
    this.articleCommandeDachat = paramCommandeDachat.articles;
    console.log(this.articleCommandeDachat);

    console.log("Type de depense_id:", typeof paramCommandeDachat.id_depense);
    console.log("Valeur de depense_id:", paramCommandeDachat.id_depense);
    if (paramCommandeDachat.id_depense == null) {
      this.isAssociatedWithDepense = false
      console.error(this.isAssociatedWithDepense)
    } else if (paramCommandeDachat.id_depense > 0) {
      this.isAssociatedWithDepense = true
      console.error(this.isAssociatedWithDepense)
    }



    for (let i = 0; i < this.articleCommandeDachat.length; i++) {
      let row = this.articleCommandeDachat[i];
      this.rows.unshift({
        "selectedProduct": row.id_article,
        "quantity": row.quantite,
        "unitPrice": row.prix_unitaire,
        "reductionArticle": row.reduction_article || 0, // Assurez-vous que la réduction est initialisée
        "tva": row.TVA_article || 0,                   // Initialisation du tva
        "total": row.prix_total_article || 0,           // Initialisation du total
        "totalTTC": row.prix_total_tva_article || 0
      });
    }

  }


  supprimerDepense(idDepense: any) {
    console.log(idDepense);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer cette dépense?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteDepense(idDepense).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeDepense();
            this.listeCommandeDachat();
            this.chargerInfosCommandeDachat(this.currentCommandeDachat);
            Loading.remove()
          }
        )
      });
  }

  updateCommandeDachat() {
    let CommandeDachat =
    {
      "active_Stock": this.active,
      "num_commandeAchat": this.nextNumber,
      "fournisseur_id": this.idFournisseur,
      "depense_id": this.recentDepenses[0].id,
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
      }>,
      "etiquettes": [] as Array<{
        id_etiquette: number,
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
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      CommandeDachat.etiquettes.push({
        id_etiquette: item,
      });
    }
    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });
    Confirm.show('Confirmer modification ',
      'Voullez-vous modifier?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.commandeAchatService.updateCommandeDachat(this.currentCommandeDachat.id, CommandeDachat).subscribe(
          (reponse) => {
            Report.success('Notiflix Success', reponse.message, 'Okay',);
            this.listeCommandeDachat();
            this.resetCommandeDachat();
            this.recentDepenses = [];
            Loading.remove();
          }
        );
      });
  }

  annulerCommandeDachat() {
    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous annuler?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.commandeAchatService.annulerCommandeDachat(this.currentCommandeDachat.id).subscribe(
          (reponse) => {
            Notify.success(reponse.message);
            this.listeCommandeDachat();
            Loading.remove();
          }
        );
      });
  }

  resetCommandeDachat(): void {
    // Réinitialiser les propriétés de CommandeDachat
    this.active = false;  // ou la valeur par défaut souhaitée
    this.nextNumber = '';  // ou la valeur par défaut souhaitée
    this.idFournisseur = '';  // ou la valeur par défaut souhaitée
    this.noteInterne = '';
    this.commentaire = '';
    this.remise = 0;
    this.dateCommande = '';  // ou la valeur par défaut souhaitée
    this.dateLivraison = '';  // ou la valeur par défaut souhaitée
    this.totalRemise = 0;

    // Vider les articles et étiquettes
    this.rows = [];  // Réinitialiser les articles
    this.selectedIds = [];  // Réinitialiser les étiquettes
  }


  // exportExcel() {
  //   this.commandeAchatService.exportToExcel().subscribe(
  //     (data: Blob) => {
  //       data.arrayBuffer().then((buffer) => {
  //         const workbook = XLSX.read(buffer, { type: 'array' });
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  //         // Augmenter la largeur des colonnes
  //         if (worksheet['!ref']) {
  //           const range = XLSX.utils.decode_range(worksheet['!ref']);
  //           const cols: XLSX.ColInfo[] = [];
  //           for (let C = range.s.c; C <= range.e.c; ++C) {
  //             cols.push({ wch: 20 }); // Définir la largeur à 15
  //           }
  //           worksheet['!cols'] = cols;
  //         }

  //         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //         const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = 'exportCommandeDachat.xlsx';
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //       });
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  etiquetteListe: any[] = [];
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

  modalName = 'ajout'

  changeValueModal(value: string) {
    this.modalName = value;
  }

  ouvrirModal() {
    if (this.modalName == 'ajout') {
      const modal = document.getElementById('commandeDachat');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'modif') {
      const modal = document.getElementById('ModalModifier');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }
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


  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = 'tabCommandeDachat';
    fileName = 'CommandeDachat.xlsx';   
    this.itemsParPage = this.tabCommandeDachatFilter.length;

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
