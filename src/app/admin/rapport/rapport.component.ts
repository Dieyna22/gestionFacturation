import { Component } from '@angular/core';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent {

  rapports = [
    { id: 'mvt', titre: 'Flux de trésorerie', label: 'Mouvements', isOpen: false },
    { id: 'vente', titre: 'Ventes / Factures', label: 'Ventes', isOpen: false },
    { id: 'depenses', titre: 'Dépenses', label: 'Dépenses', isOpen: false },
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

  toggleRapport(id: string) {
    const rapport = this.rapports.find(r => r.id === id);
    if (rapport) {
      rapport.isOpen = !rapport.isOpen;
    }
  }

}
