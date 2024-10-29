import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { PromoService } from 'src/app/services/promo.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CategorieArticleService } from '../../services/categorie-article.service';
import * as XLSX from 'xlsx';
import { GrilleTarifaireService } from '../../services/grille-tarifaire.service';
import { ClientsService } from '../../services/clients.service';
import { PermissionsService } from '../../services/permissions.service';
import { EtiquetteService } from '../../services/etiquette.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

interface Etiquette {
  id?: number;
  nom_etiquette: string;
  code_etiquette: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  @Output() etiquetteSelectionnee = new EventEmitter<Etiquette>();
  // Déclaration des variables 
  tabArticle: any[] = [];
  tabArticleFilter: any[] = [];
  tabPromo: any[] = [];
  tabCategorie: any[] = [];
  dbUsers: any;
  role: string = ''
  tabEntrepot: any[] = [];

  filterValue: string = "";
  nom: string = "";
  desc: string = "";
  vente: string = "";
  typeArticle: string = "";
  achat: string = "";
  quantite: string = "";
  quantiteAlerte: string = "";
  CategorieArticle: string = "";
  note: string = "";
  unite: string = "";
  tva: number = 0;
  titrePrix: string = "";
  tvaPrix: string = "";
  prixVente: string = "";
  entrepotName: string = "";
  addEntrepot: string = "";
  Lotnom: string = "";
  Lotquantite: string = "";
  nomVariantes: string = "";
  quantiteVariantes: string = "";
  quantiteInEntrepot: string = "";
  codeBarres: string = "";


  inputnom: string = "";
  inputdesc: string = "";
  inputvente: string = "";
  inputachat: string = "";
  inputquantite: string = "";
  inputquantiteAlerte: string = "";
  inputtypeArticle: string = "";
  inputpromo: string = "";
  inputCategorieArticle: string = "";
  inputtva: number = 0;
  inputunite: string = "";
  inputentrepotName: string = "";
  inputLotnom: string = "";
  inputLotquantite: string = "";
  inputnomVariantes: string = "";
  inputquantiteVariantes: string = "";
  inputquantiteInEntrepot: string = "";
  inputtitrePrix: string = "";
  inputtvaPrix: string = "";
  inputprixVente: string = "";
  inputcodeBarres: string = ""

  currentStep = 1;
  isFileValid = false;

  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  active: string = 'non';

  client: String = "";
  article: string = "";
  montant: string = "";

  prixList: { titrePrix: string, tva: string, montant: string }[] = [];

  // Variables pour les cases à cocher
  actifArticle: boolean = false;
  stockType: string = '';


  constructor(private http: HttpClient, private articleService: ArticlesService, private promoService: PromoService, private Categorie: CategorieArticleService, private grilleservice: GrilleTarifaireService, private clientService: ClientsService, public permissionsService: PermissionsService, private etiquetteService: EtiquetteService, private cdr: ChangeDetectorRef, private filterService: ConfigurationService) { }


  filterliste: any[] = [];
  filterProduits(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm([this.tabArticle], filterTerm, ['active_article']);
    if (this.filterliste.length == 0) {
      this.listeArticles();
    } else {
      this.tabArticleFilter = this.filterliste;
    }
  }
  actif = 1

  ngOnInit(): void {
    this.listeArticles();
    this.listePromos();
    this.listeCategorie();
    this.listeEntrepot();
    this.listeClients();
    this.listeEtiquette();
    // Abonne-toi aux changements de permissions
    this.permissionsService.permissions$.subscribe(() => {
    });

    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.role = this.dbUsers.user.role

    if (this.role == "super_admin") {
      this.isSuperAdmin = true;
      this.isAdmin = false;
      this.isUser = false;
    } else if (this.role == "administrateur") {
      this.isSuperAdmin = false;
      this.isAdmin = true;
      this.isUser = false;
    } else if (this.role == "utilisateur_simple") {
      this.isSuperAdmin = false;
      this.isAdmin = false;
      this.isUser = true;
    }
  }


  ajouterGrilles() {
    let grille = {
      "idClient": this.client,
      "idArticle": this.article,
      "montantTarif": this.montant,
      "tva": this.tva
    }
    this.grilleservice.addGrille(grille).subscribe(
      (user: any) => {
        Report.success('Notiflix Success', user.message, 'Okay',);
      },
      (err) => {
      }
    )
  }

  tabClient: any;
  listeClients() {
    this.clientService.getAllClients().subscribe(
      (clients: any) => {
        this.tabClient = clients;

      },
      (err) => {
      }
    )
  }


  // Gestion bouton
  boutonActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = 'categorie';

  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
  }

  menu: string = 'information';
  Actif = 1;
  // Mettre à jour le contenu actuel
  showMenu(menuId: string): void {
    this.menu = menuId;
  }

  ajouterEntrepot() {
    let entrepot = {
      "nomEntrepot": this.addEntrepot,
    }
    this.articleService.addEntrepot(entrepot).subscribe(
      (entrepot: any) => {
        Report.success('Notiflix Success', entrepot.message, 'Okay',);
        this.vider();
        this.listeArticles();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  listeEntrepot() {
    this.articleService.getAllEntrepot().subscribe(
      (entrepot: any) => {
        this.tabEntrepot = entrepot;
        console.log(this.tabEntrepot)
      },
      (err) => {
      }
    )
  }


  // Ajouter un autre prix
  addPrix() {
    this.prixList.push({ titrePrix: '', tva: '', montant: '' });
  }

  // Supprimer un prix
  removePrix(index: number) {
    this.prixList.splice(index, 1);
  }

  ajouterArticle() {
    console.log(this.codeBarres);
    let articles = {
      "active_Stock": this.active,
      "nom_article": this.nom,
      "description": this.desc,
      "prix_achat": this.achat,
      "prix_unitaire": this.vente,
      "tva": this.tva,
      "type_article": "produit",
      "unité": this.unite,
      "quantite": this.quantite,
      "quantite_alert": this.quantiteAlerte,
      "id_categorie_article": this.CategorieArticle,
      "code_barre": this.codeBarres,
      "autres_prix": [] as Array<{
        titrePrix: string,
        montant: string,
        tva: string
      }>,
      "variantes": [
        {
          "nomVariante": this.nomVariantes,
          "quantiteVariante": this.quantiteVariantes
        }
      ],
      "lots": [
        {
          "nomLot": this.Lotnom,
          "quantiteLot": this.Lotquantite
        }
      ],
      "entrepots": [
        {
          "entrepot_id": this.entrepotName,
          "quantiteArt_entrepot": this.quantiteInEntrepot
        }
      ],
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }

    // Ajouter des autreprix
    for (let i = 0; i < this.prixList.length; i++) {
      const item = this.prixList[i];
      console.log(item)
      articles.autres_prix.push({
        titrePrix: item.titrePrix,
        montant: item.montant,
        tva: item.tva,

      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      articles.etiquettes.push({
        id_etiquette: item,
      });
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

  products: any;
  listeArticles() {
    this.articleService.getAllArticles().subscribe(
      (article: any) => {
        this.tabArticle = article;
        this.tabArticleFilter = this.tabArticle.filter((article: any) => article.type_article == 'produit');
        console.log(this.tabArticleFilter)
        this.products = this.tabArticle;
      },
      (err) => {
        console.log(err);
      }
    )
  }


  // méthode pour vider les champs
  vider() {
    this.nom = '';
    this.desc = '';
    this.vente = '';
    this.typeArticle = '';
    this.achat = '';
    this.quantite = '';
    this.quantiteAlerte = '';
    this.CategorieArticle = '';
    this.note = '';
    this.unite = '';
    this.tva = 0;
    this.titrePrix = '';
    // this.tva = '';
    this.montant = '';
    this.entrepotName = '';
    this.addEntrepot = '';
    this.Lotnom = '';
    this.Lotquantite = '';
    this.nomVariantes = '';
    this.quantiteVariantes = '';
    this.quantiteInEntrepot = '';
    this.codeBarres = '';

    this.inputnom = '';
    this.inputdesc = '';
    this.inputvente = '';
    this.inputtypeArticle = '';
    this.inputachat = '';
    this.inputquantite = '';
    this.inputquantiteAlerte = '';
    this.inputCategorieArticle = '';
    this.inputtva = 0;
    this.inputunite = '';
    this.inputentrepotName = '';
    this.inputLotnom = '';
    this.inputLotquantite = '';
    this.inputnomVariantes = '';
    this.inputquantiteVariantes = '';
    this.inputquantiteInEntrepot = '';
    this.inputtitrePrix = '';
    this.inputtvaPrix = '';
    // this.inputmontant = '';
    this.inputcodeBarres = '';

    this.prixList.push({ titrePrix: '', tva: '', montant: '' });
    this.selectedEtiquettes.push();
  }

  deleteAricle(paramArticle: any) {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmer Suppression ',
      'Voullez-vous supprimer?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.articleService.deleteArticle(paramArticle).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeArticles();
            Loading.remove()
          }
        )
      });

  }

  currentArticle: any;
  numArticles: any;
  etiquetteListe: any[] = [];
  otherPrix: any;
  // Methode pour charger les infos de l'article  à modifier
  chargerInfosArticle(paramArticle: any) {
    console.log(paramArticle);
    this.currentArticle = paramArticle;
    this.inputnom = paramArticle.nom_article;
    this.inputdesc = paramArticle.description;
    this.inputvente = paramArticle.prix_unitaire;
    this.inputtypeArticle = paramArticle.type_article;
    this.inputachat = paramArticle.prix_achat;
    this.inputquantite = paramArticle.quantite;
    this.inputquantiteAlerte = paramArticle.quantite_alert;
    this.inputCategorieArticle = paramArticle.id_categorie_article;
    this.inputunite = paramArticle.unité;
    this.inputtva = paramArticle.tva;
    this.inputentrepotName = paramArticle.entrepot_art[0].entrepot_id;
    this.inputLotnom = paramArticle.lot[0].nomLot;
    this.inputLotquantite = paramArticle.lot[0].quantiteLot;
    this.inputnomVariantes = paramArticle.variante[0].nomVariante;
    this.inputquantiteVariantes = paramArticle.variante[0].quantiteVariante;
    this.inputquantiteInEntrepot = paramArticle.entrepot_art[0].quantiteArt_entrepot;
    // this.inputtitrePrix = paramArticle.autre_prix[0].titrePrix;
    // this.inputtvaPrix = paramArticle.autre_prix[0].tva;
    // this.inputprixVente = paramArticle.autre_prix[0].montant;
    this.numArticles = paramArticle.num_article;
    // this.etiquetteListe = paramArticle.etiquettes;
    // this.otherPrix = paramArticle.autre_prix;
    this.inputcodeBarres = paramArticle.code_barre;
    this.prixList = paramArticle.autre_prix;
    this.selectedEtiquettes = paramArticle.etiquettes;
    this.active = paramArticle.active_Stock;
  }

  updateArticle() {
    let articles = {
      "active_Stock": this.active,
      "num_article": this.numArticles,
      "nom_article": this.inputnom,
      "description": this.inputdesc,
      "prix_unitaire": this.inputvente,
      "type_article": this.currentArticle.type_article,
      "prix_achat": this.inputachat,
      "quantite": this.inputquantite,
      "quantite_alert": this.inputquantiteAlerte,
      "id_categorie_article": this.inputCategorieArticle,
      "unité": this.inputunite,
      "tva": this.inputtva,
      "code_barre": this.inputcodeBarres,
      "autres_prix": [] as Array<{
        titrePrix: string,
        montant: string,
        tva: string
      }>,
      "variantes": [
        {
          "nomVariante": this.inputnomVariantes,
          "quantiteVariante": this.inputquantiteVariantes
        }
      ],
      "lots": [
        {
          "nomLot": this.inputLotnom,
          "quantiteLot": this.inputLotquantite
        }
      ],
      "entrepots": [
        {
          "entrepot_id": this.inputentrepotName,
          "quantiteArt_entrepot": this.inputquantiteInEntrepot
        }
      ],
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>

    }

    // Ajouter des autreprix
    for (let i = 0; i < this.prixList.length; i++) {
      const item = this.prixList[i];
      console.log(item)
      articles.autres_prix.push({
        titrePrix: item.titrePrix,
        montant: item.montant,
        tva: item.tva,

      });
    }

    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      articles.etiquettes.push({
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
        this.articleService.updateArticle(this.currentArticle.id, articles).subscribe(
          (reponse) => {
            Notify.success(reponse.message);
            this.listeArticles();
            this.vider();
            Loading.remove();
          }
        );
      });
  }

  updateStockArticle() {
    let stock = {
      "quantite": this.inputquantite,
      "note": this.note,
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
        this.articleService.updateStockArticle(this.currentArticle.id, stock).subscribe(
          (reponse) => {
            Notify.success(reponse.message);
            this.listeArticles();
            this.vider();
            Loading.remove();
          }
        );
      });
  }

  listePromos() {
    this.promoService.getAllPromo().subscribe(
      (promos: any) => {
        this.tabPromo = promos.promos;
      },
      (err) => {
      }
    )
  }

  idArticle: any;
  recupIdArticle(paramArticle: any) {
    this.idArticle = paramArticle;
  }

  affecterPromo() {
    let promo = {
      "promo_id": this.inputpromo,
    }
    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous affecter une promotion?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.articleService.affecterArticle(this.idArticle, promo).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeArticles();
            Loading.remove();
          },
          (err) => {
          }
        )
      });

  }

  listeCategorie() {
    this.Categorie.getAllCategorieArticle().subscribe(
      (categories: any) => {
        this.tabCategorie = categories.CategorieArticle;
      },
      (err) => {
      }
    )
  }

  affecterCategorieArticle() {
    let CategorieArticle = {
      "id_categorie_article": this.inputCategorieArticle,
    }
    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous affecter une catégorie à cette article?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.articleService.affecterCategorieArticle(this.idArticle, CategorieArticle).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeArticles();
            this.inputCategorieArticle = '';
            Loading.remove();
          },
          (err) => {
            console.log(err)
          }
        )
      });

  }

  // Methode de recherche automatique pour un utilisateur
  onSearch() {
    // Recherche se fait selon le nom ou le prenom 
    this.tabArticleFilter = this.tabArticle.filter(
      (elt: any) => (elt?.nom_article.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.nom_categorie.toLowerCase().includes(this.filterValue.toLowerCase()))
    );
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
    return this.tabArticleFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabArticleFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabArticleFilter.length / this.itemsParPage);
  }

  showChamps: boolean = false;
  isAddCategoryChecked: boolean = false;
  afficherChamps() {
    this.showChamps = this.isAddCategoryChecked;
    this.cdr.detectChanges();
  }

  formPrix: boolean = false;
  isAddPrixChecked: boolean = false;
  afficherChampsPrix() {
    this.formPrix = this.isAddPrixChecked;
    this.cdr.detectChanges();
    if (this.isAddPrixChecked && this.prixList.length === 0) {
      this.addPrix();
    }
  }

  stock: string = '';
  afficherChampsStock(typeStock: string) {
    this.stock = typeStock
  }

  setTypeActive(type: string) {
    this.active = type;
  }

  onStockManagementChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.setTypeActive(isChecked ? 'oui' : 'non');
  }

  goToNextStep() {
    this.currentStep++;
  }

  private file: File | null = null;
  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.isFileValid = true;
  }

  downloadModel() {
    // Création du modèle de données
    const modelData = [
      {
        Libellé: '', Description: '', prix_unitaire: '', quantite: '', Prix_achat: '', categorie_article: '', tva: '', unite: '',
      }
    ];

    // Création de la feuille de calcul
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modelData);

    // Définition d'une largeur uniforme pour toutes les colonnes
    const columnWidth = 20; // Largeur en caractères


    // Application de la largeur à toutes les colonnes utilisées
    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const columnCount = range.e.c + 1; // Nombre de colonnes

      worksheet['!cols'] = Array(columnCount).fill({ wch: columnWidth });
    } else {
      // Fallback si !ref n'est pas défini (ce qui est peu probable dans ce cas)
      const columnCount = Object.keys(modelData[0]).length;
      worksheet['!cols'] = Array(columnCount).fill({ wch: columnWidth });
    }


    // Création du classeur
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Clients': worksheet },
      SheetNames: ['Clients']
    };

    // Conversion du classeur en buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Sauvegarde du fichier
    this.saveAsExcelFile(excelBuffer, "modele_ajoutArticles");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    // Création d'un Blob à partir du buffer
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    // Création d'un lien de téléchargement
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}.xlsx`;

    // Simulation du clic pour déclencher le téléchargement
    link.click();

    // Nettoyage
    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
      link.remove();
    }, 100);
  }

  uploadFile() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);

      this.http.post('http://127.0.0.1:8000/api/importArticle', formData).subscribe(
        response => { this.goToNextStep(); this.listeArticles() },
        error => console.error('Erreur d\'importation', error)
      );
    }
  }

  // exportExcel() {
  //   this.articleService.exportToExcel().subscribe(
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
  //         a.download = 'exportArticle.xlsx';
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //       });
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }


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

  ouvrirModalUpdateArticle() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('ModalModifier');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  actionsVisible: boolean = false;
  toggleActions(article: any) {
    article.actionsVisible = !article.actionsVisible;
    // Fermez les menus des autres articles
    this.tabArticle.forEach(a => {
      if (a !== article) {
        a.actionsVisible = false;
      }
    });
  }

  modalName = 'ajout'

  changeValueModal(value: string) {
    this.modalName = value;
  }

  ouvrirModal() {
    if (this.modalName == 'ajout') {
      const modal = document.getElementById('exampleModal');
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


  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = 'tabArticle';
    fileName = 'Articles.xlsx';
    this.itemsParPage = this.tabArticleFilter.length;

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
