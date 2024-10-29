import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { ClientsService } from 'src/app/services/clients.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import * as XLSX from 'xlsx';
import { GrilleTarifaireService } from 'src/app/services/grille-tarifaire.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PayementService } from 'src/app/services/payement.service';
import { EtiquetteService } from 'src/app/services/etiquette.service';
import { VenteService } from 'src/app/services/vente.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

interface Etiquette {
  id?: number;
  nom_etiquette: string;
  code_etiquette: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

  // Gestion bouton
  boutonActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = 'categorie';

  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
  }

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
  status: string = "prospect";
  isClient: boolean = false;
  type: string = "particulier";
  paysClient: string = "";
  villeClient: string = "";
  fiscal: string = "";
  nomDestinataire: string = "";
  postal: string = "";
  paysLivraison: string = "";
  villeLivraison: string = "";
  telDestinataire: string = "";
  emailDestinataire: string = "";
  infos: string = "";
  notes: string = "";


  inputprenom: string = "";
  inputnom: string = "";
  inputmail: string = "";
  inputEntreprise: string = "";
  inputClient: string = "";
  inputAdress: string = "";
  inputTelephone: string = "";
  inputstatut: string = "";
  inputtype: string = "";
  inputpaysClient: string = "";
  inputvilleClient: string = "";
  inputfiscal: string = "";
  inputnomDestinataire: string = "";
  inputpostal: string = "";
  inputpaysLivraison: string = "";
  inputvilleLivraison: string = "";
  inputtelDestinataire: string = "";
  inputemailDestinataire: string = "";
  inputinfos: string = "";
  inputnotes: string = "";

  client: String = "";
  article: string = "";
  montant: string = "";
  tva: string = "";
  moyenPayement: string = "";

  typeConversation: string = "personnelle";
  dateConversation: string = "";
  interlocuteur: string = "";
  objectConversation: string = "";
  conversations: string = "";
  statutConversation: string = "en_attente";

  inputdateConversation: string = "";
  inputinterlocuteur: string = "";
  inputobjectConversation: string = "";
  inputconversations: string = "";


  constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private payementService: PayementService, private clientService: ClientsService, private articleService: ArticlesService, private grilleservice: GrilleTarifaireService, private etiquetteService: EtiquetteService, private cdr: ChangeDetectorRef, private docService: VenteService,private filterService: ConfigurationService) { }


  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  actif = 1
  filterliste:any[]=[];
  filterClient(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabClient, filterTerm, ['statut_client','type_client']);
    if(this.filterliste.length==0){
      this.listeClients();
    }else{
      this.tabClientFilter = this.filterliste;
    } 
  }


  ngOnInit(): void {
    this.listeCategorie();
    this.listeClients();
    this.listeArticles()
    this.listePayement();
    this.listeEtiquette();
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

  products: any;
  listeArticles() {
    this.articleService.getAllArticles().subscribe(
      (article: any) => {
        this.products = article;
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


  zoneActif = 1;
  setTypeFournisseur(typeClient: string) {
    this.type = typeClient;
  }

  setTypeActive(stautChange: string) {
    this.status = stautChange;
  }

  setEtatConversation(etatvalue: string) {
    this.statutConversation = etatvalue;
  }

  changeStatut() {
    this.status = this.isClient ? 'client' : 'prospect';
  }

  zoneConversation = 1;
  setTypeConversation(value: string) {
    this.typeConversation = value;
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
      "statut_client": this.status,
      "type_client": this.type,
      "pays_client": this.paysClient,
      "ville_client": this.villeClient,
      "num_id_fiscal": this.fiscal,
      "nom_destinataire": this.nomDestinataire,
      "code_postal_livraison": this.postal,
      "pays_livraison": this.paysLivraison,
      "ville_livraison": this.villeLivraison,
      "tel_destinataire": this.telDestinataire,
      "email_destinataire": this.emailDestinataire,
      "infoSupplemnt": this.infos,
      "noteInterne_client": this.notes,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      clients.etiquettes.push({
        id_etiquette: item,
      });
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

  listeClients() {
    this.clientService.getAllClients().subscribe(
      (clients: any) => {
        this.tabClient = clients;
        this.tabClientFilter = this.tabClient;
        console.log(this.tabClientFilter);
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
    this.status = '';
    this.type = '';
    this.paysClient = '';
    this.villeClient = '';
    this.fiscal = '';
    this.nomDestinataire = '';
    this.postal = '';
    this.paysLivraison = '';
    this.villeLivraison = '';
    this.telDestinataire = '';
    this.emailDestinataire = '';
    this.infos = '';
    this.notes = '';

    this.inputnom = '';
    this.inputprenom = '';
    this.inputmail = '';
    this.inputEntreprise = '';
    this.inputClient = '';
    this.inputTelephone = '';
    this.inputAdress = '';
    this.inputstatut = '';
    this.inputtype = '';
    this.inputpaysClient = '';
    this.inputvilleClient = '';
    this.inputfiscal = '';
    this.inputnomDestinataire = '';
    this.inputpostal = '';
    this.inputpaysLivraison = '';
    this.inputvilleLivraison = '';
    this.inputtelDestinataire = '';
    this.inputemailDestinataire = '';
    this.inputinfos = '';
    this.inputnotes = '';

  }

  deleteClient(paramClient: any) {
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
        this.clientService.deleteClient(paramClient).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeClients();
            Loading.remove();
          }
        )
      });
  }

  currentClient: any;
  // Methode pour charger les infos du zone  à modifier
  chargerInfosClient(paramClient: any) {
    this.currentClient = paramClient;
    console.log(paramClient);
    this.inputnom = paramClient.nom_client;
    this.inputprenom = paramClient.prenom_client;
    this.inputmail = paramClient.email_client;
    this.inputClient = paramClient.categorie_id;
    this.inputEntreprise = paramClient.nom_entreprise;
    this.inputTelephone = paramClient.tel_client;
    this.inputAdress = paramClient.adress_client;
    this.status = paramClient.statut_client;
    this.inputtype = paramClient.type_client;
    if(this.inputtype=='particulier'){
      this.zoneActif=1;
    }else if(this.inputtype=='entreprise'){
      this.zoneActif=2;
    }
    this.inputpaysClient = paramClient.pays_client;
    this.inputvilleClient = paramClient.ville_client;
    this.inputfiscal = paramClient.num_id_fiscal;
    this.inputnomDestinataire = paramClient.nom_destinataire;
    this.inputpostal = paramClient.code_postal_livraison;
    this.inputpaysLivraison = paramClient.pays_livraison;
    this.inputvilleLivraison = paramClient.ville_livraison;
    this.inputtelDestinataire = paramClient.tel_destinataire;
    this.inputemailDestinataire = paramClient.email_destinataire;
    this.inputinfos = paramClient.infoSupplemnt;
    this.inputnotes = paramClient.noteInterne_client;
    this.selectedEtiquettes = paramClient.etiquettes;
    this.getInterlocuteurNom();

  }

  getInterlocuteurNom(): string {
    if (!this.currentClient) return '';
    return this.interlocuteur = `${this.currentClient.prenom_client || ''} ${this.currentClient.nom_client || ''}`.trim();
  }

  updateUser() {
    let clients = {
      "nom_client": this.inputnom,
      "prenom_client": this.inputprenom,
      "nom_entreprise": this.inputEntreprise,
      "adress_client": this.inputAdress,
      "email_client": this.inputmail,
      "tel_client": this.inputTelephone,
      "categorie_id": this.inputClient,
      "statut_client": this.status,
      "type_client": this.inputtype,
      "pays_client": this.inputpaysClient,
      "ville_client": this.inputvilleClient,
      "num_id_fiscal": this.inputfiscal,
      "nom_destinataire": this.inputnomDestinataire,
      "code_postal_livraison": this.inputpostal,
      "pays_livraison": this.inputpaysLivraison,
      "ville_livraison": this.inputvilleLivraison,
      "tel_destinataire": this.inputtelDestinataire,
      "email_destinataire": this.inputemailDestinataire,
      "infoSupplemnt": this.inputinfos,
      "noteInterne_client": this.inputnotes,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      clients.etiquettes.push({
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
        this.clientService.updateClient(this.currentClient.id, clients).subscribe(
          (reponse) => {
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

  showChampsAddressPrincipal: boolean = false;
  showChampsAddressLivraison: boolean = false;
  showChampsOther: boolean = false;
  currentStep = 1;
  isFileValid = false;
  afficherChampsAddressPrincipal() {
    this.showChampsAddressPrincipal = !this.showChampsAddressPrincipal;
  }

  afficherChampsAddressLivraison() {
    this.showChampsAddressLivraison = !this.showChampsAddressLivraison;
  }

  afficherChampsOther() {
    this.showChampsOther = !this.showChampsOther;
  }

  goToNextStep() {
    this.currentStep++;
  }

  downloadModel() {
    // Création du modèle de données
    const modelData = [
      {
        prenom: '', nom: '', Nom_entreprise: '', type_client: '', Statut_client: '', email_client: '', adress_client: '',
        Adresse_Code_postal: '', ville_client: '', pays_client: '', tel_client: '', noteInterne_client: '', nom_destinataire: '', pays_livraison: '',
        ville_livraison: '', code_postal_livraison: '', tel_destinataire: '', email_destinataire: '', infoSupplemnt: '',
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
    this.saveAsExcelFile(excelBuffer, "modele_ajoutClients");
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

  private file: File | null = null;
  modelHeaders: string[] = [];


  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.isFileValid = true;
  }

  uploadFile() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);

      this.http.post('http://127.0.0.1:8000/api/importClient', formData).subscribe(
        response => { this.goToNextStep(); this.listeClients() },
        error => console.error('Erreur d\'importation', error)
      );
    }

  }


  // exportExcel() {
  //   this.clientService.exportToExcel().subscribe(
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
  //         a.download = 'export.xlsx';
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

  ouvrirModalClient() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  ouvrirModalDetailClient() {
    // Utiliser l'API DOM pour ouvrir le modal
    const modal = document.getElementById('detailClient');
    if (modal) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
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


  section: string = "general"
  showSection(type: string) {
    this.section = type;
  }


  btnActif = 1;
  currentDoc: string = 'Facture'
  showTypeDocument(docId: string): void {
    this.currentDoc = docId
  }

  configDate: boolean = false
  showconfigDate() {
    this.configDate = !this.configDate;
  }

  choiceDate: boolean = false
  showchoiceDate() {
    this.choiceDate = !this.choiceDate;
  }

  changeValue() {
    this.configDate = false;
  }

  tabFactures: any[] = [];
  tabFactureFilter: any[] = [];
  listeFacture() {
    this.docService.getAllFactureByClient(this.currentClient.id).subscribe(
      (factures) => {
        this.tabFactures = factures.factures;
        this.tabFactureFilter = this.tabFactures;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  tabDevis: any[] = [];
  listeDevis() {
    this.docService.getAllDevisByClient(this.currentClient.id).subscribe(
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

  tabBonCommande: any[] = [];
  listeBonCommande() {
    this.docService.getAllBonCommandeByClient(this.currentClient.id).subscribe(
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

  tabLivraison: any;
  listeBonLivraison() {
    this.docService.getAllBonLivraisonByClient(this.currentClient.id).subscribe(
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

  tabSolde: any[] = [];
  listeSolde() {
    this.docService.getAllSoldeByClient(this.currentClient.id).subscribe(
      (solde) => {
        this.tabSolde = solde.soldes;
        console.log(this.tabSolde)
        this.tabFactureFilter = this.tabSolde
      },
      (err) => {
        console.log(err);
      }
    )
  }

  // Pagination 
  // Méthode pour déterminer les articles à afficher sur la page actuelle
  getItemsPageDocs(): any[] {
    const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
    const indexFin = indexDebut + this.itemsParPage;
    return this.tabFactureFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pagesDocs(): number[] {
    const totalPages = Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPagesDocs(): number {
    return Math.ceil(this.tabFactureFilter.length / this.itemsParPage);
  }

  ajouterConversation() {
    let conversation = {
      "type": this.typeConversation,
      "date_conversation": this.dateConversation,
      "interlocuteur": this.interlocuteur,
      "objet": this.objectConversation,
      "message_conversation": this.conversations,
      "statut": this.statutConversation,
      "client_id": this.currentClient.id
    }
    this.clientService.addConversation(conversation).subscribe(
      (chat: any) => {
        Report.success('Notiflix Success', chat.message, 'Okay',);
      },
      (err) => {
      }
    )

  }

  conversationByClient: any[] = [];
  listeConversationByClient() {
    this.clientService.getAllConversationByClient(this.currentClient.id).subscribe(
      (response) => {
        this.conversationByClient = response;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  currentConversation: any;
  chargerInfosConversation(paramConversation: any) {
    this.currentConversation = paramConversation;
    console.log(paramConversation)
    this.typeConversation = paramConversation.type
    if(this.typeConversation=='personnelle'){
      this.zoneConversation=1;
    }else if(this.typeConversation=='email'){
      this.zoneConversation=2;
    }else if(this.typeConversation=='message'){
      this.zoneConversation=3;
    }else if(this.typeConversation=='telephone'){
      this.zoneConversation=4;
    }else if(this.typeConversation=='courier_postal'){
      this.zoneConversation=5;
    }
    this.inputdateConversation = paramConversation.date_conversation;
    this.inputinterlocuteur = paramConversation.interlocuteur;
    this.inputobjectConversation = paramConversation.objet;
    this.inputconversations = paramConversation.message_conversation;
    this.statutConversation = paramConversation.statut;
  }

  modifierConversation(){
    let conversation = {
      "type": this.typeConversation,
      "date_conversation": this.inputdateConversation,
      "interlocuteur": this.inputinterlocuteur,
      "objet": this.inputobjectConversation,
      "message_conversation": this.inputconversations,
      "statut": this.statutConversation,
      "client_id": this.currentClient.id
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
        this.clientService.updateConversation(this.currentClient.id,conversation).subscribe(
          (reponse) => {
            Notify.success(reponse.message);
            this.vider();
            this.listeConversationByClient();
            Loading.remove();
          }
        )
      });
  }

  deleteConversation(paramClient: any) {
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
        this.clientService.deleteConveration(paramClient).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeConversationByClient();
            Loading.remove();
          }
        )
      });
  }

  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = 'tabClient';
    fileName = 'Clients.xlsx';
    this.itemsParPage = this.tabClientFilter.length;

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