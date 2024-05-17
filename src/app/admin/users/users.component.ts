import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
   // Déclaration des variables 
   tabUserNoArchiver: any[] = [];
   tabUserNoArchiverFilter: any[] = [];
   tabRole: any[] = [];
 
   filterValue: string = "";
   prenom: string = "";
   nom: string = "";
   mail: string = "";
   pass: string = "";
   role: string = "";

   inputprenom: string = "";
   inputnom: string = "";
   inputmail: string = "";
   inputpass: string = "";
   inputrole: string = "";



   constructor(private http: HttpClient, private ServiceRole: RoleService, private userService:UtilisateurService) { }


   showPassword: boolean = false;

   togglePasswordVisibility() {
     this.showPassword = !this.showPassword;
   }

   ngOnInit(): void {
    this.listeRole();
    this.listeUserNoArchiver();
  }

  listeRole() {
    this.ServiceRole.getAllRole().subscribe(
      (roles: any) => {
        this.tabRole = roles;
      },
      (err) => {
      }
    )
  }


  ajouterUsers(){
    let users={
      "nom":this.nom,
      "prenom":this.prenom,
      "email":this.mail,
      "password":this.pass,
      "id_role":this.role,
    }
    this.userService.addUser(users).subscribe(
      (user:any)=>{
        Report.success('Notiflix Success',user.message,'Okay',);
        this.vider();
        this.listeUserNoArchiver();
      },
      (err) => {
      }
    )
  }

  listeUserNoArchiver() {
    this.userService.getAllUserNoArchiver().subscribe(
      (userNoArchiver: any) => {
        this.tabUserNoArchiver = userNoArchiver;
        this.tabUserNoArchiverFilter = this.tabUserNoArchiver;
      },
      (err) => {
      }
    )
  }

  // méthode pour vider les champs
  vider(){
    this.nom='';
    this.prenom='';
    this.mail='';
    this.pass='';
    this.role='';
    this.inputnom='';
    this.inputprenom='';
    this.inputmail='';
    this.inputpass='';
    this.inputrole='';
  }

  archiver(paramUser:any){
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation ',
    'Voullez-vous vous archiver?',
    'Oui','Non',() => 
      {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.userService.archiver(paramUser).subscribe(
          (response)=>{
            Notify.success(response.message);
            this.listeUserNoArchiver();
            Loading.remove();

          }
        )
      });
  }

  currentUser: any;
  // Methode pour charger les infos du zone  à modifier
  chargerInfosUser(paramUser:any){
    this.currentUser = paramUser;
    this.inputnom = paramUser.nom;
    this.inputprenom = paramUser.prenom;
    this.inputmail = paramUser.email;
    this.inputrole = paramUser.id_role;
    this.inputpass =paramUser.password;
  }

  updateUser() {
    let users={
      "nom":this.inputnom,
      "prenom":this.inputprenom,
      "email":this.inputmail,
      "password":this.inputpass,
      "id_role":this.inputrole,
      "archiver": this.currentUser.archiver,
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
        this.userService.updateUser(this.currentUser.id,users).subscribe(
          (reponse)=>{
            Notify.success(reponse.message);
            this.listeUserNoArchiver();
            this.vider();
            Loading.remove();
          }
        );
      });
    
  } 

  // Methode de recherche automatique pour un utilisateur
  onSearch() {
    // Recherche se fait selon le nom ou le prenom 
    this.tabUserNoArchiverFilter = this.tabUserNoArchiver.filter(
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
    return this.tabUserNoArchiverFilter.slice(indexDebut, indexFin);
  }

  // Méthode pour générer la liste des pages
  get pages(): number[] {
    const totalPages = Math.ceil(this.tabUserNoArchiverFilter.length / this.itemsParPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.tabUserNoArchiverFilter.length / this.itemsParPage);
  }
}
