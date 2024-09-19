import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
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

  currentStep = 1;
  isFileValid = false;

  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  active: string = 'non';

  client: String = "";
  article: string = "";
  montant: string = "";


  constructor(private http: HttpClient, private articleService: ArticlesService, private promoService: PromoService, private Categorie: CategorieArticleService, private grilleservice: GrilleTarifaireService, private clientService: ClientsService, public permissionsService: PermissionsService, private etiquetteService: EtiquetteService) { }



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

  ajouterArticle() {
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
      "autres_prix": [
        {
          "titrePrix": this.titrePrix,
          "montant": this.prixVente,
          "tva": this.tvaPrix
        }
      ],
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
      ]
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
    this.tvaPrix = '';
    this.prixVente = '';
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
    this.inputprixVente = '';
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
    this.inputtitrePrix = paramArticle.autre_prix[0].titrePrix;
    this.inputtvaPrix = paramArticle.autre_prix[0].tva;
    this.inputprixVente = paramArticle.autre_prix[0].montant;
    this.numArticles = paramArticle.num_article;
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
      "autres_prix": [
        {
          "titrePrix": this.inputtitrePrix,
          "montant": this.inputprixVente,
          "tva": this.inputtvaPrix
        }
      ],
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
      ]

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

  afficherChamps() {
    this.showChamps = !this.showChamps;
  }

  formPrix: boolean = false;
  afficherChampsPrix() {
    this.formPrix = !this.formPrix;
  }

  stock: string = '';
  afficherChampsStock(typeStock: string) {
    this.stock = typeStock
  }

  setTypeActive(type: string) {
    this.active = type;
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

  exportExcel() {
    this.articleService.exportToExcel().subscribe(
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
          a.download = 'exportArticle.xlsx';
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
  etiquette = { nom: '', couleur: '' };
  etiquettes: { nom: string, couleur: string }[] = [];

  selectionnerCouleur(couleur: string) {
    this.etiquette.couleur = couleur;
  }

  ajouterEtiquette() {
    // if (this.etiquette.nom && this.etiquette.couleur) {
    //   this.etiquettes.push({ ...this.etiquette });
    // }
    let etiquette = {
      nomEtiquette: this.etiquette.nom,
      codeEtiquette: this.etiquette.couleur
    }

    this.etiquetteService.addEtiquette(etiquette).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error)
      }
    )


  }

  tabEtiquette: any;
  listeEtiquette() {
    this.etiquetteService.getAllEtiquette().subscribe(
      (reponse) => {
        this.tabEtiquette = reponse.etiquette;
        console.log(this.tabEtiquette);
      },
      (error) => {
        console.log(error)
      }
    )
  }

  supprimerEtiquette(index: number) {
    this.etiquettes.splice(index, 1);
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
  toggleActions() {
    this.actionsVisible = !this.actionsVisible;
  }

}
