import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(private articleService: ArticlesService) { }

  ngOnInit(): void {
    this.listeStock();
    this.listeStockUpdate();
  }


  tabStock: any[] = [];
  tabStockFilter: any[] = [];
  listeStock() {
    this.articleService.getAllStock().subscribe(
      (response)=>{
        this.tabStock = response.stocks;
        this.tabStockFilter = this.tabStock;
        console.log(this.tabStock);
      },
      (error)=>{
        console.log(error)
      }
    )
  }


  tabStockUpdate: any[] = [];
  listeStockUpdate(){
    this.articleService.getAllStockUpdate().subscribe(
      (response)=>{
        this.tabStockUpdate = response.stocks;
        // this.tabStockFilter = this.tabStockUpdate;
        console.log(this.tabStockUpdate);
      },
      (error)=>{
        console.log(error)
      }
    )
  }


  calculateDisponibleNouveau(item: any): number {
    return item.disponible_actuel + item.quantite_ajoutee;
  }
  
  updateDisponibleNouveau(index: number): void {
    this.tabStockUpdate[index].disponible_nouveau = this.calculateDisponibleNouveau(this.tabStockUpdate[index]);
  }

  modifiedItems: Set<number> = new Set();

  markAsModified(index: number): void {
    this.modifiedItems.add(index);
  }

  increment(index: number): void {
    this.tabStockUpdate[index].quantite_ajoutee++;
    this.updateDisponibleNouveau(index);
    this.markAsModified(index);
  }

  decrement(index: number): void {
    if (this.tabStockUpdate[index].quantite_ajoutee > 0) {
      this.tabStockUpdate[index].quantite_ajoutee--;
      this.updateDisponibleNouveau(index);
      this.markAsModified(index);
    }
  }

  getModifiedItems(): any[] {
    return Array.from(this.modifiedItems).map(index => ({
      id_stock: this.tabStockUpdate[index].id,
      quantite_ajoutee: this.tabStockUpdate[index].quantite_ajoutee
    }));
  }


  updateStock(){
    let stock = {
      stock_modifier: this.getModifiedItems()
    };
    this.articleService.updateStock(stock).subscribe(
      (response)=>{
        console.log(response);
      },
      (error)=>{
        console.log(error);
      }
    )
  }


  // Attribut pour la pagination
  itemsParPage = 5; // Nombre d'articles par page
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
    return this.tabStockFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabStockFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabStockFilter.length / this.itemsParPage);
  }
}
