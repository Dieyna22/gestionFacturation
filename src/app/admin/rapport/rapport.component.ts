import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

interface Rapport {
  id: string;
  titre: string;
  label: string;
  isOpen: boolean;
  type: 'bar' | 'line' | 'pie' | 'none';
  getData: () => any;
}

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  rapports = [
    {
      id: 'mvt',
      titre: 'Flux de trésorerie',
      label: 'Mouvements',
      isOpen: false,
      type: 'bar',
      getData: () => ({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Flux de trésorerie',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      })
    },
    {
      id: 'vente',
      titre: 'Ventes / Factures',
      label: 'Ventes',
      isOpen: false,
      type: 'line',
      getData: () => ({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Ventes',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      })
    },
    {
      id: 'depenses',
      titre: 'Dépenses',
      label: 'Dépenses',
      isOpen: false,
      type: 'none',
      getData: () => 'Ceci est un rapport textuel sans graphique.'
    },
    { id: 'resultat', titre: 'Résultat', label: 'Résultat', isOpen: false },
    { id: 'pRecu', titre: 'Paiements reçus', label: 'Paiements reçus', isOpen: false },
    { id: 'pAttente', titre: 'Paiements en attente', label: 'Paiements en attente', isOpen: false },
    { id: 'commandes', titre: 'Commandes de vente', label: 'Commandes', isOpen: false },
    { id: 'livraison', titre: 'Livraisons', label: 'Livraisons', isOpen: false },
    { id: 'paiements', titre: 'Moyen de paiements', label: 'Paiements', isOpen: false },
    { id: 'tva', titre: 'TVA', label: 'TVA', isOpen: false },
    { id: 'journalVente', titre: 'Journal Ventes', label: 'Ventes', isOpen: false },
    { id: 'journalAchat', titre: 'Journal Achats', label: 'Dépenses', isOpen: false },
    { id: 'stock', titre: 'Valeur du stock', label: 'Stock', isOpen: false },
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

  closeModal() {
    this.selectedRapport = null;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  
  generateRapport() {
    if (this.selectedRapport  && this.chartCanvas) {
      // const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        if (this.charts) {
          this.charts.destroy();
        }
        const data = this.selectedRapport.getData();
        this.charts = new Chart(ctx, {
          type: this.selectedRapport.type as "bar" | "line" | "pie",
          data: data,
          options: {
            // ... your options here
          }
        }) as Chart<"bar" | "line" | "pie", number[], string>;
      }
    }
  }
}
