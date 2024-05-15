import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-user-archiver',
  templateUrl: './user-archiver.component.html',
  styleUrls: ['./user-archiver.component.css']
})
export class UserArchiverComponent {
// Déclaration des variables 
tabUserArchiver: any[] = [];
tabUserArchiverFilter: any[] = [];

filterValue: string = "";




constructor(private http: HttpClient, private ServiceRole: RoleService, private userService:UtilisateurService) { }


showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

ngOnInit(): void {
 this.listeUserArchiver();
}


listeUserArchiver() {
 this.userService.getAllUserArchiver().subscribe(
   (userArchiver: any) => {
     this.tabUserArchiver = userArchiver;
     this.tabUserArchiverFilter = this.tabUserArchiver;
   },
   (err) => {
   }
 )
}

desarchiver(paramUser:any){
 this.userService.desarchiver(paramUser).subscribe(
   (response)=>{
     alert(response);
     this.listeUserArchiver();
   }
 )
}


// Methode de recherche automatique pour un utilisateur
onSearch() {
 // Recherche se fait selon le nom ou le prenom 
 this.tabUserArchiverFilter = this.tabUserArchiver.filter(
   (elt: any) => (elt?.nom.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom.toLowerCase().includes(this.filterValue.toLowerCase()))
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
 return this.tabUserArchiverFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabUserArchiverFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabUserArchiverFilter.length / this.itemsParPage);
}
}
