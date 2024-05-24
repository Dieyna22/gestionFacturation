import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  constructor(private http: HttpClient, private clientService:ClientsService, private userService:UtilisateurService,private productService:ArticlesService,private renderer: Renderer2) { 
    this.currentDate = this.getCurrentDate();
  }

  ngAfterViewInit() {
    this.updateTableHeaderColor();
  }

  ngOnInit(){
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
    
    this.listeClients();
    this.listeInfoSup();
    this.listeArticles();
  }

  color: string = '#02016F';

  onColorChange() {
    this.updateTableHeaderColor();
 
  }
  private updateTableHeaderColor() {
    const theadCells = document.querySelectorAll('thead th');
    theadCells.forEach((cell: any) => {
      this.renderer.setStyle(cell, 'background-color', this.color);
      this.renderer.setStyle(cell, 'color', 'white');
    });
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


  isPreview: boolean = false;

  togglePreviewMode() {
    this.isPreview = !this.isPreview;
  }


  generatePdf() {
    // Récupérer le contenu du div "print-section"
    const printSection = document.getElementById('print-section');
    if (printSection) {
      // Capturer une image du contenu du div "print-section"
      html2canvas(printSection).then(canvas => {
        // Créer un nouveau document PDF
        const pdf = new jsPDF();
  
        // Ajouter l'image du contenu au PDF
        const imgData = canvas.toDataURL('image/png');
        // Avec 8 arguments
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'myImage', 'FAST');
        
        // Enregistrer le PDF
        pdf.save('facture.pdf');
      });
    } else {
      // Gérer le cas où printSection est null
      console.error('printSection est null');
    }
  }
}
