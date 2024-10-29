import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(private articleService: ArticlesService, private filterService: ConfigurationService) { }


  actif = 1
  filterliste:any[]=[];
  filterStock(filterTerm: string) {
    this.filterliste = this.filterService.filterByTerm(this.tabStock, filterTerm, ['type_stock']);
    if(this.filterliste.length==0){
      this.listeStock();
    }else{
      this.tabStockFilter = this.filterliste;
    } 
  }

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

  exportExcel() {
    const originalPage = this.pageActuelle;
    const originalItemsPerPage = this.itemsParPage;
    let idTab: string;
    let fileName: string;


    idTab = 'tabStock';
    fileName = 'Stock.xlsx';   
    this.itemsParPage = this.tabStockFilter.length;

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
