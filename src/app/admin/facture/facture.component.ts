import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent {

  dbUsers: any;
  tabClient: any[] = [];
  clientId: string = "";
  filterValue: string = "";

  constructor(private http: HttpClient, private clientService:ClientsService, private userService:UtilisateurService,private productService:ArticlesService,) { 
    this.currentDate = this.getCurrentDate();
  }

  ngOnInit(){
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
    
    this.listeClients();
    this.listeInfoSup();
    this.listeArticles();

    
  }


listeClients() {
  this.clientService.getAllClients().subscribe(
    (clients: any) => {
      this.tabClient = clients;
    },
    (err) => {
    }
  )
 }

 selectedClient: any;
 currentClient: any;

  onClientSelected() {
    this.currentClient = this.tabClient.filter((client : any) => client.id == this.selectedClient);
  }

  currentDate: string;

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }

  InfoSup: any;
  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup=infoSup.user;
      },
      (err) => {
      }
    )
  }

  rows: any[] = [
    { selectedProduct: '', quantity: 0,  unitPrice: 0, total: 0 }
  ];

  addRow(): void {
    this.rows.push({ selectedProduct: '', quantity: 0, unitPrice: 0, total: 0 });
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
  }

  calculateTotal(row: any): void {
    row.total = row.quantity * (row.promotionalPrice || row.unitPrice);
    this.calculateGrandTotal();
  }
  total: number = 0;

  calculateGrandTotal(): void {
    this.total = this.rows.reduce((sum, row) => sum + row.total, 0);
  }

  products:any;
  listeArticles() {
    this.productService.getAllArticles().subscribe(
      (article: any) => {
        this.products = article.articles;
      },
      (err) => {
      }
    )
   }

   currentProduct: any;
  onProductSelect(row: any): void {
    this.currentProduct = this.products.filter((product : any) => product.id == row.selectedProduct);
    row.unitPrice = this.currentProduct[0].prix_unitaire;
    row.promotionalPrice = this.currentProduct[0].prix_promo;
  }



}
