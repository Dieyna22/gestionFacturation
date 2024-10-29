import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { VenteService } from 'src/app/services/vente.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { PayementService } from 'src/app/services/payement.service';
import { DatePipe } from '@angular/common';
import { EtiquetteService } from 'src/app/services/etiquette.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import * as XLSX from 'xlsx';

interface Etiquette {
  id?: number;
  nom_etiquette: string;
  code_etiquette: string;
}

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.css']
})
export class DepenseComponent {
  @Output() etiquetteSelectionnee = new EventEmitter<Etiquette>();

  selectedPrefix: string = '';
  customPrefix: string = '';
  nextNumber: string = '000000';
  nextNumberDepense: string = '000000';
  baseNumber: string = '000000';
  prefix: string = '';
  updateNum: string = '';
  numerotation: string = '';
  typeFournisseur: string = '';
  prenom: string = '';
  nom: string = '';
  codepostal: string = '';
  email: string = '';
  adresse: string = '';
  ville: string = '';
  tel: string = '';
  pays: string = '';
  note: string = '';
  nomEntreprise: string = '';
  codeFiscal: string = '';
  tabFournisseur: any[] = [];
  tabFournisseurFilter: any[] = [];
  tabDepense: any[] = [];

  categorie: string = '';
  periode: string = '';
  durePeriode: string = '';
  date: string = '';
  montantEcheance: string = '';
  datePay: string = '';
  numero: string = '';
  dateFacture: string = '';
  active: boolean = false;
  statutPay: string = 'impayer';
  moyenPayement: string = "";
  depensePay: boolean = false;
  Duree: boolean = false;
  tva: number = 0;
  montantPay: number = 0;
  montantPayTtc: number = this.montantPay;
  compte: string = '';
  banque: string = '';
  guichet: string = '';
  rib: string = '';
  iban: string = '';
  imageFacture: File | null = null;;


  constructor(private http: HttpClient, private payementService: PayementService, private docService: VenteService, private datePipe: DatePipe, private etiquetteService: EtiquetteService, private cdr: ChangeDetectorRef, private filterService: ConfigurationService) {
  }

  boutonActif = 1;
  currentDoc: string = 'fournisseur'
  showTypeDocument(docId: string): void {
    this.currentDoc = docId
  }

  showChamps: boolean = false;

  afficherChamps() {
    this.showChamps = !this.showChamps;
  }
  // Initialiser le contenu actuel
  currentContent: string = 'zoneParticulier';
  zoneActif = 0;
  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
  }

  setTypeFournisseur(type: string) {
    this.typeFournisseur = type;
  }

  setTypeActive(type: boolean) {
    this.active = type;
  }

  setTypeImpay(type: string) {
    this.statutPay = type;
  }

  setTypedepensePay(type: boolean) {
    this.depensePay = type;
  }

  setTypeDuree(type: boolean) {
    this.Duree = type;
  }

  currentNumConfig: string = 'sansPrefixes';
  showNumConfig(configId: string) {
    this.currentNumConfig = configId
  }

  showTva: boolean = false;
  showInputTva() {
    this.showTva = !this.showTva;
  }
  actif = 1
  
  filterliste:any[]=[];
  filterFournisseur(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabFournisseur, filterTerm, ['type_fournisseur']);
    if(this.filterliste.length==0){
      this.listeFournisseur();
    }else{
      this.tabFournisseurFilter = this.filterliste;
    } 
  }

  filterDepense(filterTerm: string) {
    this.filterliste = this.tabDepense.filter(depense => {
      if (filterTerm === 'payer') {
        return depense.statut_depense === 'payer' || depense.statut_depense === true;
      } else if (filterTerm === 'impayer') {
        return depense.statut_depense === 'impayer' || depense.statut_depense === false;
      }
      return false;
    });
    if(this.filterliste.length==0){
      this.listeDepense();
    }else{
      this.tabFournisseurFilter = this.filterliste;
    } 
  }

  ngOnInit() {
    this.listeNumber();
    this.listeNumberDepense();
    this.listeFournisseur();
    this.listeCategorieDepense();
    this.listePayement();
    this.listeEtiquette();
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
    this.nextNumberDepense = this.prefix + this.baseNumber + 1;
  }

  configurationNumero() {
    let numFacture =
    {
      type_document: 'fournisseur',
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
  configurationNumeroDepense() {
    let numFacture =
    {
      type_document: 'depense',
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
    this.docService.getAllNumeroFournisseur().subscribe(
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

  etiquetteListe: any[] = [];

  addFournisseur() {
    let fournisseur =
    {
      type_fournisseur: this.typeFournisseur,
      prenom_fournisseur: this.prenom,
      nom_fournisseur: this.nom,
      code_postal_fournisseur: this.codepostal,
      email_fournisseur: this.email,
      adress_fournisseur: this.adresse,
      ville_fournisseur: this.ville,
      tel_fournisseur: this.tel,
      pays_fournisseur: this.pays,
      noteInterne_fournisseur: this.note,
      nom_entreprise: this.nomEntreprise,
      num_id_fiscal: this.codeFiscal,
      code_banque: this.banque,
      code_guichet: this.guichet,
      num_compte: this.compte,
      cle_rib: this.rib,
      iban: this.iban,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      fournisseur.etiquettes.push({
        id_etiquette: item,
      });
    }

    this.docService.createFournisseur(fournisseur).subscribe(
      (response) => {
        console.log(response);
        this.listeFournisseur();
        this.vider();
        Report.success('Notiflix Success', response.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
  }


  listeFournisseur() {
    this.docService.getAllFournisseur().subscribe(
      (response) => {
        this.tabFournisseur = response;
        this.tabFournisseurFilter = this.tabFournisseur; // Copie du tableau pour filtrer les données
        console.log('Liste des fournisseurs : ', response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des fournisseurs : ', error);
      }
    );
  }

  supprimerFournisseur(idFournisseur: any) {
    console.log(idFournisseur);
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation',
      'Voullez-vous supprimer ce fournisseur?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.docService.deleteFournisseur(idFournisseur).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeFournisseur();
            Loading.remove()
          }
        )
      });
  }

  numFournisseur: any
  currentFournisseur: any;
  chargerInfoFournisseur(paramFournisseur: any) {
    console.log(paramFournisseur);
    this.currentFournisseur = paramFournisseur;
    this.numFournisseur = paramFournisseur.num_fournisseur;
    this.prenom = paramFournisseur.prenom_fournisseur;
    this.nom = paramFournisseur.nom_fournisseur;
    this.adresse = paramFournisseur.adress_fournisseur;
    this.ville = paramFournisseur.ville_fournisseur;
    this.codepostal = paramFournisseur.code_postal_fournisseur;
    this.email = paramFournisseur.email_fournisseur;
    this.tel = paramFournisseur.tel_fournisseur;
    this.pays = paramFournisseur.pays_fournisseur;
    this.note = paramFournisseur.noteInterne_fournisseur;
    this.nomEntreprise = paramFournisseur.nom_entreprise;
    this.codeFiscal = paramFournisseur.num_id_fiscal;
    this.selectedEtiquettes = paramFournisseur.etiquettes;
    this.compte = paramFournisseur.num_compte;
    this.banque = paramFournisseur.code_banque;
    this.guichet = paramFournisseur.code_guichet;
    this.rib = paramFournisseur.cle_rib;
    this.iban = paramFournisseur.iban
    this.typeFournisseur = paramFournisseur.type_fournisseur;
    if (this.typeFournisseur == 'particulier') {
      this.zoneActif = 1;
    } else if (this.typeFournisseur == 'entreprise') {
      this.zoneActif = 2;
    }
  }


  updateFournisseur() {
    let fournisseur =
    {
      type_fournisseur: this.typeFournisseur,
      prenom_fournisseur: this.prenom,
      nom_fournisseur: this.nom,
      code_postal_fournisseur: this.codepostal,
      email_fournisseur: this.email,
      adress_fournisseur: this.adresse,
      ville_fournisseur: this.ville,
      tel_fournisseur: this.tel,
      pays_fournisseur: this.pays,
      noteInterne_fournisseur: this.note,
      nom_entreprise: this.nomEntreprise,
      num_id_fiscal: this.codeFiscal,
      code_banque: this.banque,
      code_guichet: this.guichet,
      num_compte: this.compte,
      cle_rib: this.rib,
      iban: this.iban,
      "etiquettes": [] as Array<{
        id_etiquette: number,
      }>
    }
    // Ajouter des etiquette
    for (let i = 0; i < this.selectedIds.length; i++) {
      const item = this.selectedIds[i];
      console.log(item)
      fournisseur.etiquettes.push({
        id_etiquette: item,
      });
    }
    this.docService.updateFournisseur(this.currentFournisseur.id, fournisseur).subscribe(
      (response) => {
        console.log(response);
        this.listeFournisseur();
        this.vider();
        Report.success('Notiflix Success', response.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  vider() {
    this.typeFournisseur = '';
    this.prenom = '';
    this.nom = '';
    this.adresse = '';
    this.ville = '';
    this.codepostal = '';
    this.email = '';
    this.tel = '';
    this.pays = '';
    this.note = '';
    this.nomEntreprise = '';
    this.codeFiscal = '';
    this.currentFournisseur = null;
    this.numFournisseur = null;

    this.input = [
      { date: '', prix: 0 }
    ];


    this.categorie = '';
    this.periode = '';
    this.durePeriode = '';
    this.date = '';
    this.montantEcheance = '';
    this.datePay = '';
    this.montantPay = 0;
    this.tva = 0;
    this.numero = '';
    this.dateFacture = '';
    this.active = false;
    this.statutPay = 'impayer';
    this.moyenPayement = "";
    this.montantPayTtc = 0;
    this.depensePay = false;
    this.Duree = false;


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

  infosPayement: boolean = false;
  showInfosPayement() {
    this.infosPayement = !this.infosPayement;
  }

  echeancePay: boolean = false;
  showEcheancePay() {
    this.echeancePay = !this.echeancePay;
  }

  infosFacture: boolean = false;
  showInfosFacture() {
    this.infosFacture = !this.infosFacture;
  }


  addCategorieDepense() {
    let categorieDepense =
    {
      nom_categorie_depense: this.categorie,
    }
    this.docService.createCategorieDepense(categorieDepense).subscribe(
      (response) => {
        console.log(response);
        this.listeCategorieDepense();
        Report.success('Notiflix Success', response.message, 'Okay',);
      },
      (err) => {
        console.log(err);
      }
    )
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

  idFournisseur: string='';
  idcurrentFournisseur: any
  currentFournisseurSelected: any;
  onClientSelected() {
    this.currentFournisseurSelected = this.tabFournisseur.filter((fournisseur: any) => fournisseur.id == this.idFournisseur);
    this.idcurrentFournisseur = this.idFournisseur
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

  getFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné:', file);
      this.imageFacture = file;
      console.log(this.imageFacture)
    } else {
      console.log('Aucun fichier sélectionné');
    }
  }



  createDepense() {
    let formData = new FormData();
    // Conversion des booléens en chaînes
    formData.append('activation', this.active.toString());
    formData.append('id_categorie_depense', this.categorie.toString());
    formData.append('date_paiement', this.datePay);
    formData.append('commentaire', this.note);
    formData.append('tva_depense', this.tva.toString());
    formData.append('montant_depense_ht', this.montantPay.toString());
    formData.append('montant_depense_ttc', this.montantPayTtc.toString());
    // formData.append('num_facture', this.numero);
    formData.append('date_facture', this.dateFacture);
    if (this.imageFacture) {
      formData.append('image_facture', this.imageFacture);
    }
    formData.append('fournisseur_id', this.idFournisseur);
    formData.append('statut_depense', this.statutPay.toString());
    formData.append('id_paiement', this.moyenPayement.toString());
    formData.append('doc_externe', '');
    formData.append('plusieurs_paiement', this.depensePay ? "1" : "0");
    formData.append('duree_indeterminee', this.Duree ? "1" : "0");
    formData.append('periode_echeance', this.durePeriode.toString());
    formData.append('nombre_periode', this.periode.toString());
    // Ajout des échéances
    this.input.forEach((item, index) => {
      formData.append(`echeances[${index}][date_pay_echeance]`, item.date);
      formData.append(`echeances[${index}][montant_echeance]`, item.prix.toString());
    });
    // Ajout des étiquettes
    this.selectedIds.forEach((item, index) => {
      formData.append(`etiquettes[${index}][id_etiquette]`, item.toString());
    });

    this.docService.createDepense(formData).subscribe(
      (response) => {
        console.log(response);
        this.vider();
        Report.success('Notiflix Success', response.message, 'Okay',);
        this.listeDepense();
      },
      (err) => {
        console.log(err);
      }
    )
  }



  listeDepense() {
    this.docService.getAllDepense().subscribe(
      (response) => {
        this.tabDepense = response.depenses;
        console.log('Liste des dépenses : ', this.tabDepense);
        this.tabFournisseurFilter = this.tabDepense;
      },
      (error) => {
        console.error('Erreur lors de la récupération des dépenses : ', error);
      }
    );
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
            Loading.remove()
          }
        )
      });
  }


  numDepense: any
  currentDepense: any;
  chargerInfoDepense(paramDepense: any) {
    this.currentDepense = paramDepense;
    this.numDepense = paramDepense.num_depense;
    console.log(paramDepense)

    this.categorie = paramDepense.categorie_depense_id;
    this.note = paramDepense.commentaire;
    this.active = paramDepense.activation;
    this.tva = paramDepense.tva_depense;
    this.montantPay = paramDepense.montant_depense_ht;
    this.montantPayTtc = paramDepense.montant_depense_ttc;
    this.numero = paramDepense.num_facture;
    this.dateFacture = paramDepense.date_facture;
    this.statutPay = paramDepense.statut_depense;
    this.moyenPayement = paramDepense.id_paiement;
    this.Duree = paramDepense.duree_indeterminee;
    this.periode = paramDepense.nombre_periode;
    this.durePeriode = paramDepense.periode_echeance;
    this.datePay = paramDepense.date_paiement;
    this.selectedEtiquettes = paramDepense.etiquettes;
    this.idFournisseur = paramDepense.id_fournisseur;
  }

  updateDepense() {
    let depense =
    {
      "activation": this.active,
      "id_categorie_depense": this.categorie,
      "fournisseur_id": this.idFournisseur,
      "date_paiement": this.datePay,
      "commentaire": this.note,
      "tva_depense": this.tva,
      "montant_depense_ht": this.montantPay,
      "montant_depense_ttc": this.montantPayTtc,
      "num_facture": this.numero,
      "date_facture": this.dateFacture,
      "statut_depense": this.statutPay,
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
    this.docService.updateDepense(this.currentDepense.id, depense).subscribe(
      (response) => {
        console.log(response);
        this.vider();
        this.listeDepense();
        this.showInputTva();
        Report.success('Notiflix Success', response.message, 'Okay',);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la dépense : ', error);
      }
    )
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

  calculerProchaineDateDepense(datePaiement: string, periodeEcheance: string): string {
    const date = new Date(datePaiement);

    switch (periodeEcheance) {
      case 'jour':
        date.setDate(date.getDate() + 1);
        break;
      case 'semaine':
        date.setDate(date.getDate() + 7);
        break;
      case 'mois':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        return 'Période d\'échéance invalide';
    }

    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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
    const modal = document.getElementById('addfournisseur');
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
    if (this.modalName == 'ajoutFournisseur') {
      const modal = document.getElementById('addfournisseur');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'updateFournisseur') {
      const modal = document.getElementById('updateFournisseur');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'ajoutDepense') {
      const modal = document.getElementById('adddepence');
      if (modal) {
        // @ts-ignore
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    } else if (this.modalName == 'modifDepense') {
      const modal = document.getElementById('updateDepense');
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
    return this.tabFournisseurFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabFournisseurFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabFournisseurFilter.length / this.itemsParPage);
  }


  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = this.currentDoc;
    fileName = `${this.currentDoc}.xlsx`;   
    this.itemsParPage = this.tabFournisseurFilter.length;

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
