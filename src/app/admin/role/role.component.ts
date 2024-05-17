import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

   // Déclaration des variables 
   tabRole: any[] = [];
   tabRoleFilter: any[] = [];
   inputrole:string="" ;
   champsRole:string="";

  constructor(private http: HttpClient, private role: RoleService) { }

  ajouterZone() {
    let role ={
      "role":this.inputrole,
    }

    this.role.addRole(role).subscribe(
      (response) => {
      Report.success('Notiflix Success',response.message,'Okay',);
      this.inputrole="";
      this.listeRole();
    }
  );
  }

  ngOnInit(): void {
    this.listeRole();
  }

  listeRole() {
    this.role.getAllRole().subscribe(
      (roles: any) => {
        this.tabRole = roles;
        this.tabRoleFilter = this.tabRole;
      },
      (err) => {
      }
    )
  }

currentRole: any;
ChargeInfosRole(paramRole:any){
    this.currentRole = paramRole;
    this.champsRole = paramRole.role;
}

updateRole() {
  let roles={
    "role":this.champsRole,
  }
  Confirm.init({
    okButtonBackground: '#5C6FFF',
    titleColor: '#5C6FFF'
  });
  Confirm.show('Confirmer modification ',
  'Voullez-vous modifier?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.role.updateRole(this.currentRole.id,roles).subscribe(
        (reponse)=>{
          this.listeRole();
          this.champsRole='';
          Notify.success(reponse.message);
          Loading.remove();
        }
      );
    });
}

deleteRole(roleId:any){
  Confirm.init({
    okButtonBackground: '#FF1700',
    titleColor: '#FF1700'
  });
  Confirm.show('Confirmer Suppression ',
  'Voullez-vous supprimer?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.role.deleteRole(roleId).subscribe(
        (reponse)=>{
          Notify.success(reponse.message);
          this.listeRole();
          Loading.remove();
        }
      )
    });
}

  itemsParPage = 3; // Nombre d'articles par page
  pageActuelle = 1; // Page actuelle

  // Pagination 
  // Méthode pour déterminer les articles à afficher sur la page actuelle
  getItemsPage(): any[] {
    const indexDebut = (this.pageActuelle - 1) * this.itemsParPage;
    const indexFin = indexDebut + this.itemsParPage;
    return this.tabRoleFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabRoleFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabRoleFilter.length / this.itemsParPage);
  }

}
