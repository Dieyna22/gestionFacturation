import { Component } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  // Tableau d'objets avec chaque ligne contenant une quantité
  items = [
    { name: 'Produit 1', quantity: 0 , dispo:20 ,sum: 0},
    { name: 'Produit 2', quantity: 0 , dispo:20 ,sum: 0},
    { name: 'Produit 3', quantity: 0 , dispo:20 ,sum: 0},
    // Ajoutez plus de lignes selon vos besoins
  ];

  // Incrémente la quantité et met à jour la somme
  increment(index: number) {
    this.items[index].quantity++;
    this.updateSum(index);
  }

  // Décrémente la quantité et met à jour la somme
  decrement(index: number) {
    if (this.items[index].quantity > 0) {
      this.items[index].quantity--;
    }
    this.updateSum(index);
  }

   // Met à jour la somme pour chaque item
   updateSum(index: number) {
    this.items[index].sum = this.items[index].dispo + this.items[index].quantity;
  }
}
