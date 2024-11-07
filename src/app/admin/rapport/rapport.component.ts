import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { ConfigurationService } from 'src/app/services/configuration.service';
import * as XLSX from 'xlsx';

interface Rapport {
  id: string;
  titre: string;
  label: string;
  isOpen: boolean;
  type: 'bar' | 'line' | 'pie' | 'none';
  getData: () => any;
}

interface MonthlyData {
  [key: string]: {
    factureHT: number;
    factureTTC: number;
    depenseHT: number;
    depenseTTC: number;
    res: number,
  }
}

interface Paiement {
  id_facture?: number;
  id_depense?: number;
  nom_payement: string;
  montant: string;
}

interface PaiementSomme {
  nom_payement: string;
  montant_total: number;
}

// Interfaces
interface TVA {
  num_facture?: string;
  num_depense?: string;
  Prenom_Nom_client?: string;
  categorie?: string;
  fournisseur?: string;
  tva: string | number;
  montant_TVA: number;
}

interface TVASeparee {
  taux_tva: string;
  montant_totalTVAFacture: number;
  montant_totalTVADepense: number;
}

interface ClientSomme {
  nomClient: string;
  total_HT: number;
  total_TTC: number;
}

interface ArticleSomme {
  nom_article: string;
  quantite_totale: number;
  total_HT: number;
  total_TTC: number;
}

// Interfaces pour typer les données
interface Fournisseur {
  id: number;
  num_fournisseur: string;
  nom_fournisseur: string;
  prenom_fournisseur: string;
  nom_entreprise: string | null;
  // ... autres champs si nécessaires
}

interface CategorieDepense {
  id: number;
  nom_categorie_depense: string;
  // ... autres champs si nécessaires
}

interface Depense {
  id: number;
  num_depense: string;
  commentaire: string;
  date_paiement: string;
  tva_depense: number;
  montant_depense_ht: string;
  montant_depense_ttc: string;
  statut_depense: string;
  fournisseur: Fournisseur;
  categorie_depense: CategorieDepense;
}

interface GroupedExpenseData {
  [category: string]: {
    totalHT: number;
    totalTTC: number;
    categoryId: number;
    fournisseurs: {
      [fournisseur: string]: {
        depenseHT: number;
        depenseTTC: number;
        fournisseurId: number;
        depenses: Depense[];
      }
    }
  }
}

interface GroupedByCategory {
  [category: string]: {
    nomCategory: string;
    totalHT: number;
    totalTTC: number;
    categoryId: number;
    depenses: Depense[];
  }
}

interface GroupedByFournisseur {
  [fournisseur: string]: {
    totalHT: number;
    totalTTC: number;
    fournisseurId: number;
    depenses: Depense[];
  }
}


@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {

  constructor(private rapportService: ConfigurationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const today = new Date();

    // Date du premier jour du mois en cours
    this.dateDebut = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    // Date d'aujourd'hui
    this.dateFin = today.toISOString().split('T')[0];

    this.cdr.detectChanges();
  }

  dateDebut: string = "";
  dateFin: string = "";

  dateD: string = "";
  dateF: string = "";

  pageDepenses: number = 1;
  pageFactures: number = 1;

  depenseHT: number = 0;
  depenseTTC: number = 0;
  factureHT: number = 0;
  factureTTC: number = 0;
  monthlyData: MonthlyData = {};
  labels: any[] = [];
  depense: any;
  facture: any;
  depenseListe: any;
  factureListe: any;

  private extractNumber(item: any, key: string): number {
    return Number(item[key] || 0);
  }


  private getMonthKey(date: string | null): string {
    // Vérifier si la date est null ou undefined
    if (!date) {
      console.warn('Date invalide détectée:', date);
      return '';
    }
    return date.substring(0, 7); // Format: "YYYY-MM"
  }

  private initializeMonthData(monthKey: string) {
    if (!this.monthlyData[monthKey]) {
      this.monthlyData[monthKey] = {
        factureHT: 0,
        factureTTC: 0,
        depenseHT: 0,
        depenseTTC: 0,
        res: 0
      };
    }
  }

  listeFluxTresorerie() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportFluxTrésorerie(date).subscribe(
      (response: any) => {
        console.log(response);
        this.depenseListe = response.depenses;
        this.factureListe = response.factures;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.depenseHT = 0;
        this.depenseTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.factures.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_creation);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'prix_TTC');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Traitement des dépenses
        response.depenses.forEach((depense: any) => {
          const monthKey = this.getMonthKey(depense.date_paiement);
          this.initializeMonthData(monthKey);

          const depenseHT = this.extractNumber(depense, 'montant_depense_ht');
          const depenseTTC = this.extractNumber(depense, 'montant_depense_ttc');

          this.depenseHT += depenseHT;
          this.depenseTTC += depenseTTC;
          console.log(depenseTTC)
          this.monthlyData[monthKey].depenseHT += depenseHT;
          this.monthlyData[monthKey].depenseTTC += depenseTTC;
        });

        // Affichage des résultats
        console.log('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.depense = this.labels.map(month => this.monthlyData[month].depenseTTC);
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);

        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  updateDateRange() {
    if (this.dateDebut && this.dateFin) {
      this.listeFluxTresorerie();
    }
  }

  listeVente() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportFacture(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response.rapport;
        this.calculerSommesClients();
        this.calculerSommesArticles();

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.rapport.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_facture);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'prix_TTC');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Affichage des résultats
        console.error('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);


        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  clientsSommes: ClientSomme[] = [];
  articlesSommes: ArticleSomme[] = [];

  calculerSommesClients(): void {
    // Créer un objet temporaire pour faire les sommes
    const sommes: { [key: string]: ClientSomme } = {};

    // Calculer la somme pour chaque client
    this.factureListe.forEach((facture: any) => {
      const clientKey = `${facture.client_nom}_${facture.client_prenom}`;
      const montantHT = parseFloat(facture.prix_HT) || 0;
      const montantTTC = parseFloat(facture.prix_TTC) || 0;

      if (sommes[clientKey]) {
        sommes[clientKey].total_HT += montantHT;
        sommes[clientKey].total_TTC += montantTTC;
      } else {
        sommes[clientKey] = {
          nomClient: `${facture.client_prenom} ${facture.client_nom}`,
          total_HT: montantHT,
          total_TTC: montantTTC
        };
      }
    });

    // Convertir l'objet en tableau pour l'affichage
    this.clientsSommes = Object.values(sommes);
    console.log('Sommes par client:', this.clientsSommes);

  }

  calculerSommesArticles(): void {
    // Créer un objet temporaire pour faire les sommes
    const sommes: { [key: string]: ArticleSomme } = {};

    // Calculer la somme pour chaque article
    this.factureListe.forEach((facture: any) => {
      facture.articles?.forEach((article: any) => {
        const nomArticle = article.nom_article;
        const quantite = parseInt(article.quantite) || 0;
        const totalHT = parseFloat(article.prix_total_ht) || 0;
        const totalTTC = parseFloat(article.prix_total_ttc) || 0;

        if (sommes[nomArticle]) {
          sommes[nomArticle].quantite_totale += quantite;
          sommes[nomArticle].total_HT += totalHT;
          sommes[nomArticle].total_TTC += totalTTC;
        } else {
          sommes[nomArticle] = {
            nom_article: nomArticle,
            quantite_totale: quantite,
            total_HT: totalHT,
            total_TTC: totalTTC
          };
        }
      });
    });

    // Convertir l'objet en tableau pour l'affichage
    this.articlesSommes = Object.values(sommes);
    console.log('Sommes par article:', this.articlesSommes);
  }

  updateDateRangeVente() {
    if (this.dateDebut && this.dateFin) {
      this.listeVente();
    }
  }

  // Ajout de la propriété groupedData avec son type
  groupedData: GroupedExpenseData = {};
  groupedByCategory: GroupedByCategory = {};
  groupedByFournisseur: GroupedByFournisseur = {};
  labelsCategory: any;
  depenseCategory: any;
  labelsFournisseur: any;
  depenseFournisseur: any;
  listeCategory: any;
  listeFournissuer: any;

  listeDepense() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportDepense(date).subscribe(
      (response: Depense[]) => {
        console.log(response);
        this.depenseListe = response;

        // Réinitialiser les totaux
        this.depenseHT = 0;
        this.depenseTTC = 0;

        // Structure pour stocker les dépenses groupées par catégorie et fournisseur
        const groupedByCategory: GroupedByCategory = {};
        const groupedByFournisseur: GroupedByFournisseur = {};

        // Traitement des dépenses
        response.forEach((depense: Depense) => {
          const category = depense.categorie_depense?.nom_categorie_depense;
          const fournisseurNom = depense.fournisseur?.nom_entreprise ||
            `${depense.fournisseur?.nom_fournisseur} ${depense.fournisseur?.prenom_fournisseur}`.trim();

          const depenseHT = parseFloat(depense.montant_depense_ht);
          const depenseTTC = parseFloat(depense.montant_depense_ttc);

          // --- Grouping by Category ---
          if (!groupedByCategory[category]) {
            groupedByCategory[category] = {
              nomCategory: depense.categorie_depense?.nom_categorie_depense,
              totalHT: 0,
              totalTTC: 0,
              categoryId: depense.categorie_depense?.id,
              depenses: []
            };
          }

          // Ajouter les montants pour la catégorie
          groupedByCategory[category].totalHT += depenseHT;
          groupedByCategory[category].totalTTC += depenseTTC;
          groupedByCategory[category].depenses.push(depense);

          // --- Grouping by Fournisseur ---
          if (!groupedByFournisseur[fournisseurNom]) {
            groupedByFournisseur[fournisseurNom] = {
              totalHT: 0,
              totalTTC: 0,
              fournisseurId: depense.fournisseur?.id,
              depenses: []
            };
          }

          // Ajouter les montants pour le fournisseur
          groupedByFournisseur[fournisseurNom].totalHT += depenseHT;
          groupedByFournisseur[fournisseurNom].totalTTC += depenseTTC;
          groupedByFournisseur[fournisseurNom].depenses.push(depense);

          // Mettre à jour les totaux globaux
          this.depenseHT += depenseHT;
          this.depenseTTC += depenseTTC;
        });

        // Conversion des données pour le graphique
        const categories = Object.keys(groupedByCategory);
        this.labelsCategory = categories;
        this.depenseCategory = categories.map(cat => groupedByCategory[cat].totalHT);

        this.listeCategory = groupedByCategory;

        const fournisseur = Object.keys(groupedByFournisseur);
        this.labelsFournisseur = fournisseur;
        this.depenseFournisseur = fournisseur.map(cat => groupedByFournisseur[cat].totalHT);

        // Stocker les données groupées pour l'affichage
        this.groupedByCategory = groupedByCategory;
        this.groupedByFournisseur = groupedByFournisseur;

        console.log('Données groupées par catégorie:', groupedByCategory);
        console.log('Données groupées par fournisseur:', groupedByFournisseur);

        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport();
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }
  listePaiementRecu() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportPaiementRecu(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_recu);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'montant');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Affichage des résultats
        console.error('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);


        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  listePaiementEnAttents() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportPaiement_enAttents(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_pay_echeance);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'montant_echeance');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Affichage des résultats
        console.error('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);


        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  listeCommandeVente() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportCommandeVente(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_limite_commande);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'prix_TTC');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Affichage des résultats
        console.error('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);


        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  listeLivraison() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportLivraison(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_livraison);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'prix_HT');
          const factureTTC = this.extractNumber(facture, 'prix_TTC');

          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;
        });

        // Affichage des résultats
        console.error('Données mensuelles:', this.monthlyData);

        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);


        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  PaiementListe: Paiement[] = []; // Assurez-vous que cette propriété existe
  paiementsSommes: PaiementSomme[] = [];

  calculerSommePaiements(): void {
    // Créer un objet temporaire pour faire les sommes
    const sommes: { [key: string]: number } = {};

    // Calculer la somme pour chaque moyen de paiement
    this.factureListe.forEach((paiement: Paiement) => {
      const montant = parseFloat(paiement.montant) || 0;
      if (sommes[paiement.nom_payement]) {
        sommes[paiement.nom_payement] += montant;
      } else {
        sommes[paiement.nom_payement] = montant;
      }
    });

    // Convertir l'objet en tableau pour le graphique
    this.paiementsSommes = Object.entries(sommes).map(([nom_payement, montant_total]) => ({
      nom_payement,
      montant_total
    }));

    console.log('Sommes par moyen de paiement:', this.paiementsSommes);
  }

  listeMoyenPaiement() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportMoyenPayement(date).subscribe(
      (response: any) => {
        console.log(response);
        this.factureListe = response.payements_utilises;
        this.calculerSommePaiements();
        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  TVAs_utilises: TVA[] = [];
  tvasSeparees: TVASeparee[] = [];

  calculerSommeTVASeparee(): void {
    const sommes: { [key: string]: { factures: number; depenses: number } } = {};

    this.TVAs_utilises.forEach((tva: TVA) => {
      // Normaliser le taux de TVA (convertir en nombre puis en string avec 0 décimales)
      let tauxTVA = typeof tva.tva === 'string' ? parseFloat(tva.tva) : tva.tva;
      const tauxTVAKey = `${Math.round(tauxTVA)}%`;
      const montantTVA = tva.montant_TVA || 0;

      // Ignorer les TVA à 0%
      if (tauxTVA === 0) {
        return;
      }

      if (!sommes[tauxTVAKey]) {
        sommes[tauxTVAKey] = { factures: 0, depenses: 0 };
      }

      // Ajouter au montant approprié
      if (tva.num_depense) {
        sommes[tauxTVAKey].depenses += montantTVA;
      } else if (tva.num_facture) {
        sommes[tauxTVAKey].factures += montantTVA;
      }
    });

    // Convertir l'objet en tableau
    this.tvasSeparees = Object.entries(sommes).map(([taux_tva, montants]) => ({
      taux_tva,
      montant_totalTVAFacture: montants.factures,
      montant_totalTVADepense: montants.depenses
    }));

    console.log('TVAs séparées:', this.tvasSeparees);
  }

  listeTva() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportTVA(date).subscribe(
      (response: any) => {
        console.log(response);
        this.TVAs_utilises = response.TVAs_utilises;
        this.calculerSommeTVASeparee()
        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  resultat: any
  listeResulat() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportResultat(date).subscribe(
      (response: any) => {
        console.log(response);
        this.depenseListe = response.depenses;
        this.factureListe = response.factures;

        // Réinitialiser les totaux et les données mensuelles
        this.factureHT = 0;
        this.factureTTC = 0;
        this.depenseHT = 0;
        this.depenseTTC = 0;
        this.monthlyData = {};

        // Traitement des factures
        response.factures.forEach((facture: any) => {
          const monthKey = this.getMonthKey(facture.date_creation);
          this.initializeMonthData(monthKey);

          const factureHT = this.extractNumber(facture, 'montant_ht');
          const factureTTC = this.extractNumber(facture, 'montant_ttc');
          const resultat = 0;
          this.factureHT += factureHT;
          this.factureTTC += factureTTC;
          console.log(factureTTC)
          this.monthlyData[monthKey].factureHT += factureHT;
          this.monthlyData[monthKey].factureTTC += factureTTC;

          // Calcul du résultat mensuel
          this.monthlyData[monthKey].res = this.monthlyData[monthKey].depenseTTC - this.monthlyData[monthKey].factureTTC;
        });

        // Traitement des dépenses
        response.depenses.forEach((depense: any) => {
          const monthKey = this.getMonthKey(depense.date_creation);
          this.initializeMonthData(monthKey);

          const depenseHT = this.extractNumber(depense, 'montant_ht');
          const depenseTTC = this.extractNumber(depense, 'montant_ttc');

          this.depenseHT += depenseHT;
          this.depenseTTC += depenseTTC;
          console.log(depenseTTC)
          this.monthlyData[monthKey].depenseHT += depenseHT;
          this.monthlyData[monthKey].depenseTTC += depenseTTC;

          // Mise à jour du résultat mensuel
          this.monthlyData[monthKey].res = this.monthlyData[monthKey].depenseTTC - this.monthlyData[monthKey].factureTTC;
        });

        // Affichage des résultats
        console.log('Données mensuelles:', this.monthlyData);

        const res = this.depense - this.facture;
        // Extraire les labels (mois) et les données
        this.labels = Object.keys(this.monthlyData).sort();
        this.depense = this.labels.map(month => this.monthlyData[month].depenseTTC);
        this.facture = this.labels.map(month => this.monthlyData[month].factureTTC);
        this.resultat = this.labels.map(month => this.monthlyData[month].res);

        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  journalVente: any;
  listeJournalVentes() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportJournalVentes(date).subscribe(
      (response: any) => {
        console.log(response);
        this.journalVente = response;
        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  journalDachat: any;
  listeJournalDachat() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportJournalDachat(date).subscribe(
      (response: any) => {
        console.log(response);
        this.journalDachat = response;
        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  ValeurStock: any;
  listeValeurStock() {
    const date = {
      date_debut: this.dateDebut,
      date_fin: this.dateFin
    };

    this.rapportService.getRapportValeurStock(date).subscribe(
      (response: any) => {
        console.log(response);
        this.ValeurStock = response;
        // Ajouter un petit délai
        setTimeout(() => {
          this.generateRapport(); // Votre méthode qui génère le graphique
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }


  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  rapports = [
    {
      id: 'mvt',
      titre: 'Flux de trésorerie',
      label: 'Mouvements',
      isOpen: false,
      type: 'line',
      getData: () => ({
        labels: this.labels, // Les mois
        datasets: [
          {
            label: 'Dépenses TTC',
            data: this.depense,  // Tableau des dépenses mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          },
          {
            label: 'Factures TTC',
            data: this.facture,  // Tableau des factures mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          },
        ]
      }),
    },
    {
      id: 'vente',
      titre: 'Ventes / Factures',
      label: 'Ventes',
      isOpen: false,
      type: 'bar',
      getData: () => {
        return this.getDataForView() || {};

      }
      // getData: () => ({
      //   labels: this.labels,
      //   datasets: [{
      //       label: 'Ventes',
      //       data: this.facture,
      //       fill: false,
      //       backgroundColor: 'rgb(75, 192, 192)',
      //       tension: 0.1
      //     }]
      // }),
      //  getData: () => ({
      //    axis: 'y',
      //    labels: this.clientsSommes.map(client => client.nomClient),
      //    datasets: [{
      //      label: 'Ventes',
      //      data: this.clientsSommes.map(client => client.total_TTC),
      //      fill: false,
      //      backgroundColor: [
      //        'rgba(255, 99, 132, 0.2)',
      //        'rgba(255, 159, 64, 0.2)',
      //        'rgba(255, 205, 86, 0.2)',
      //        'rgba(75, 192, 192, 0.2)',
      //        'rgba(54, 162, 235, 0.2)',
      //        'rgba(153, 102, 255, 0.2)',
      //        'rgba(201, 203, 207, 0.2)'
      //      ],
      //      tension: 0.1
      //    }],
      //  }),
      //  getData: () => ({
      //    axis: 'y',
      //    labels: this.articlesSommes.map(article => article.nom_article),
      //    datasets: [{
      //      label: 'Articles',
      //      data: this.articlesSommes.map(article => article.total_TTC),
      //      fill: false,
      //      backgroundColor: [
      //        'rgba(255, 99, 132, 0.2)',
      //        'rgba(255, 159, 64, 0.2)',
      //        'rgba(255, 205, 86, 0.2)',
      //        'rgba(75, 192, 192, 0.2)',
      //        'rgba(54, 162, 235, 0.2)',
      //        'rgba(153, 102, 255, 0.2)',
      //        'rgba(201, 203, 207, 0.2)'
      //      ],
      //      tension: 0.1
      //    }],
      //  })
    },
    {
      id: 'depenses',
      titre: 'Dépenses',
      label: 'Dépenses',
      isOpen: false,
      type: 'pie',
      getData: () => ({
        labels: this.labelsFournisseur,
        datasets: [{
          label: 'Depenses',
          data: this.depenseFournisseur,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1,
          barPercentage: 0.5

        }],
      })

    },
    {
      id: 'resultat',
      titre: 'Résultat',
      label: 'Résultat',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.labels, // Les mois
        datasets: [
          {
            label: 'Dépenses TTC',
            data: this.depense,  // Tableau des dépenses mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          },
          {
            label: 'Factures TTC',
            data: this.facture,  // Tableau des factures mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          },
          {
            label: 'Resultat',
            data: this.resultat,  // Tableau des resultat
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          }
        ]
      }),
    },
    {
      id: 'pRecu',
      titre: 'Paiements reçus',
      label: 'Paiements reçus',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.labels, // Les mois
        datasets: [
          {
            label: 'Paiements reçus',
            data: this.facture,  // Tableau des factures mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          }
        ]
      }),
    },
    {
      id: 'pAttente',
      titre: 'Paiements en attente',
      label: 'Paiements en attente',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.labels, // Les mois
        datasets: [
          {
            label: 'Paiements en attente',
            data: this.facture,  // Tableau des factures mensuelles
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
            fill: false,
            tension: 0.1
          }
        ]
      }),
    },
    {
      id: 'commandes',
      titre: 'Commandes de vente',
      label: 'Commandes',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.labels,
        datasets: [{
          label: 'Commandes de ventes',
          data: this.facture,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1,
          barPercentage: 0.5,
          tension: 0.1
        }]
      })
    },
    {
      id: 'livraison',
      titre: 'Livraisons',
      label: 'Livraisons',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.labels,
        datasets: [{
          label: 'Livraisons',
          data: this.facture,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1,
          barPercentage: 0.5,
          tension: 0.1
        }]
      })
    },
    {
      id: 'paiements',
      titre: 'Moyen de paiements',
      label: 'Paiements',
      isOpen: false,
      type: 'pie',
      getData: () => ({
        labels: this.paiementsSommes.map(p => p.nom_payement),
        datasets: [{
          label: 'Moyen de paiements',
          data: this.paiementsSommes.map(p => p.montant_total),
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1,
          barPercentage: 0.5
          // hoverOffset: 4

        }],
      })

    },
    {
      id: 'tva',
      titre: 'TVA',
      label: 'TVA',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: this.tvasSeparees.map(t => t.taux_tva),
        datasets: [
          {
            label: 'TVA Factures',
            data: this.tvasSeparees.map(t => t.montant_totalTVAFacture),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5
          },
          {
            label: 'TVA Dépenses',
            data: this.tvasSeparees.map(t => t.montant_totalTVADepense),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5
          }
        ]
      })
    },
    {
      id: 'journalVente',
      titre: 'Journal Ventes',
      label: 'Ventes',
      isOpen: false,
      type: 'none',
      getData: () => '',
    },
    {
      id: 'journalAchat',
      titre: 'Journal Achats',
      label: 'Dépenses',
      isOpen: false,
      type: 'none',
      getData: () => '',
    },
    {
      id: 'stock',
      titre: 'Valeur du stock',
      label: 'Stock',
      isOpen: false,
      type: 'none',
      getData: () => '',
    },
  ];

  selectedRapport: any = null;
  chart: Chart | null = null;
  charts: Chart<"bar" | "line" | "pie", number[], string> | undefined;

  ngAfterViewInit() {
    // Cette méthode sera appelée après chaque changement de vue
    this.generateRapport();
  }

  toggleRapport(id: string) {
    const rapport = this.rapports.find(r => r.id === id);
    if (rapport) {
      rapport.isOpen = !rapport.isOpen;
    }
  }

  openModal(rapport: any) {
    this.selectedRapport = rapport;
    // Utilisons setTimeout pour s'assurer que le DOM est mis à jour avant d'initialiser le graphique
    setTimeout(() => this.generateRapport(), 0);
  }

  listeRapport(rapport: any) {
    this.selectedRapport = rapport;
    if (this.selectedRapport.id == "mvt") {
      this.listeFluxTresorerie();
      this.cdr.detectChanges();
    } else if (this.selectedRapport.id == "vente") {
      this.listeVente();
      this.cdr.detectChanges();
    } else if (this.selectedRapport.id == "depenses") {
      this.listeDepense();
      this.cdr.detectChanges();
    } else if (this.selectedRapport.id == "pRecu") {
      this.cdr.detectChanges();
      this.listePaiementRecu();
    } else if (this.selectedRapport.id == "pAttente") {
      this.cdr.detectChanges();
      this.listePaiementEnAttents();
    } else if (this.selectedRapport.id == "commandes") {
      this.cdr.detectChanges();
      this.listeCommandeVente();
    } else if (this.selectedRapport.id == "livraison") {
      this.cdr.detectChanges();
      this.listeLivraison();
    } else if (this.selectedRapport.id == "paiements") {
      this.cdr.detectChanges();
      this.listeMoyenPaiement();
    } else if (this.selectedRapport.id == "tva") {
      this.cdr.detectChanges();
      this.listeTva();
    } else if (this.selectedRapport.id == "resultat") {
      this.cdr.detectChanges();
      this.listeResulat();
    } else if (this.selectedRapport.id == "journalVente") {
      this.cdr.detectChanges();
      this.listeJournalVentes();
    } else if (this.selectedRapport.id == "journalAchat") {
      this.cdr.detectChanges();
      this.listeJournalDachat();
    } else if (this.selectedRapport.id == "stock") {
      this.cdr.detectChanges();
      this.listeValeurStock();
    }
  }

  closeModal() {
    this.selectedRapport = null;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  generateRapport() {
    if (this.selectedRapport && this.chartCanvas) {
      // const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        if (this.charts) {
          this.charts.destroy();
        }
        this.cdr.detectChanges();
        const data = this.selectedRapport.getData();
        this.charts = new Chart(ctx, {
          type: this.selectedRapport.type as "bar" | "line" | "pie",
          data: data,
          options: {
            //  indexAxis: 'y',
          }

        }) as Chart<"bar" | "line" | "pie", number[], string>;
        this.cdr.detectChanges();
      }
    }
  }

  itemsPerPage: number = 2;  // nombre d'éléments par page
  exportExcel() {
    const originalPageDepenses = this.pageDepenses;
    const originalPageFactures = this.pageFactures;
    const originalItemsPerPage = this.itemsPerPage;
    let idTab: string;
    let fileName: string;

    try {
      switch (this.selectedRapport.id) {
        case "mvt":
          idTab = 'tableDataFlux';
          fileName = 'Flux de trésorerie.xlsx';
          this.pageDepenses = 1;
          this.pageFactures = 1;
          this.itemsPerPage = Math.max(this.depenseListe.length, this.factureListe.length);
          break;

        case "vente":
          idTab = 'tableDataVente';
          fileName = 'Vente.xlsx';
          this.pageFactures = 1;
          this.itemsPerPage = this.factureListe.length;
          break;

        default:
          throw new Error("Type de rapport non reconnu");
      }

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
        this.pageDepenses = originalPageDepenses;
        this.pageFactures = originalPageFactures;
        this.itemsPerPage = originalItemsPerPage;
      }, 300);
    }
  }

  // Une seule variable pour gérer l'affichage
  currentView: 'facture' | 'client' | 'article' = 'facture';


  // Fonction pour gérer le changement de vue
  onGroupByChange(event: any): void {
    const selectedId = event.target.id;

    switch (selectedId) {
      case 'groupByInvoice':
        this.currentView = 'facture';
        break;
      case 'groupByClient':
        this.currentView = 'client';
        break;
      case 'groupByProduct':
        this.currentView = 'article';
        break;
    }

    // Réinitialiser la pagination
    this.pageFactures = 1;
    this.generateRapport();
  }

  // Fonction qui récupère les données selon la vue sélectionnée
  getDataForView(): any {
    switch (this.currentView) {
      case 'facture':
        return {
          labels: this.labels,
          datasets: [{
            label: 'Ventes',
            data: this.facture,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5
          }]
        };

      case 'client':
        return {
          labels: this.clientsSommes.map((client: any) => client.nomClient),
          datasets: [{
            label: 'Clients',
            data: this.clientsSommes.map((client: any) => client.total_TTC),
            fill: false,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5,
          }]
        };

      case 'article':
        return {
          labels: this.articlesSommes.map((article: any) => article.nom_article),
          datasets: [{
            label: 'Produit/Service',
            data: this.articlesSommes.map((article: any) => article.total_TTC),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            barPercentage: 0.5
          }]
        };

      default:
        return {};  // Assure qu'une valeur vide est retournée si nécessaire
    }
  }

}


