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
  tabUserArchiver: any[] = [];
  tabUserArchiverFilter: any[] = [];

  actif = 1;

  filterValue: string = "";
  prenom: string = "";
  nom: string = "";
  mail: string = "";
  pass: string = "";
  role: string = "";

  // Variables pour les cases à cocher
  visibiliteGlobale: boolean = false;
  fonctionAdmin: boolean = false;
  accesRapport: boolean = false;
  gestionStock: boolean = false;
  commandeAchat: boolean = false;
  exportExcel: boolean = false;
  supprimerDonnees: boolean = false;

  inputprenom: string = "";
  inputnom: string = "";
  inputmail: string = "";
  inputpass: string = "";
  inputrole: string = "";
  inputpassactuel : string = "";
  inputpassnew : string = "";




  constructor(private http: HttpClient, private ServiceRole: RoleService, private userService: UtilisateurService) { }


  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  boutonActif = 1;
  section: string = "general"
  showSection(type: string) {
    this.section = type;
  }

  password: boolean = false;
  showUpdatePassword() {
    this.password = !this.password
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


  ajouterUsers() {
    let users = {
      "nom": this.nom,
      "prenom": this.prenom,
      "email": this.mail,
      "password": this.pass,
      "role": this.role,
      visibilite_globale: this.visibiliteGlobale ? '1' : '0',
      fonction_admin: this.fonctionAdmin ? '1' : '0',
      acces_rapport: this.accesRapport ? '1' : '0',
      gestion_stock: this.gestionStock ? '1' : '0',
      commande_achat: this.commandeAchat ? '1' : '0',
      export_excel: this.exportExcel ? '1' : '0',
      supprimer_donnees: this.supprimerDonnees ? '1' : '0'
    }
    this.userService.addUser(users).subscribe(
      (user: any) => {
        Report.success('Notiflix Success', user.message, 'Okay',);
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
        console.log(this.tabUserNoArchiver);
      },
      (err) => {
      }
    )
  }

  // méthode pour vider les champs
  vider() {
    this.nom = '';
    this.prenom = '';
    this.mail = '';
    this.pass = '';
    this.role = '';
    this.inputnom = '';
    this.inputprenom = '';
    this.inputmail = '';
    this.inputpass = '';
    this.inputrole = '';
  }

  archiver(paramUser: any) {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous bloquer cette utilisateur?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.userService.archiver(paramUser).subscribe(
          (response) => {
            Notify.success(response.message);
            this.listeUserNoArchiver();
            Loading.remove();

          }
        )
      });
  }

  currentUser: any;
  // Methode pour charger les infos du zone  à modifier
  chargerInfosUser(paramUser: any) {
    this.currentUser = paramUser;
    this.inputnom = paramUser.nom;
    this.inputprenom = paramUser.prenom;
    this.inputmail = paramUser.email;
    this.inputrole = paramUser.role;
    this.inputpass = paramUser.password;
    this.visibiliteGlobale = paramUser.visibilite_globale;
    this.fonctionAdmin = paramUser.fonction_admin;
    this.accesRapport = paramUser.acces_rapport;
    this.gestionStock = paramUser.gestion_stock;
    this.commandeAchat = paramUser.commande_achat;
    this.exportExcel = paramUser.export_excel;
    this.supprimerDonnees = paramUser.supprimer_donnees;
  }

  updateUser() {
    let users = {
      "nom": this.inputnom,
      "prenom": this.inputprenom,
      "email": this.inputmail,
      "role": this.inputrole,
      "archiver": this.currentUser.archiver,
      mot_de_passe_actuel: this.inputpassactuel,
      password: this.inputpassnew,
      visibilite_globale: this.visibiliteGlobale ? '1' : '0',
      fonction_admin: this.fonctionAdmin ? '1' : '0',
      acces_rapport: this.accesRapport ? '1' : '0',
      gestion_stock: this.gestionStock ? '1' : '0',
      commande_achat: this.commandeAchat ? '1' : '0',
      export_excel: this.exportExcel ? '1' : '0',
      supprimer_donnees: this.supprimerDonnees ? '1' : '0'
    }
    Confirm.init({
      okButtonBackground: '#5C6FFF',
      titleColor: '#5C6FFF'
    });
    Confirm.show('Confirmer modification ',
      'Voullez-vous modifier?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        this.userService.updateUser(this.currentUser.id, users).subscribe(
          (reponse) => {
            console.log(users);
            console.log(reponse);
            Notify.success(reponse.message);
            this.listeUserNoArchiver();
            this.vider();
            Loading.remove();
          }
        );
      });

  }

  listeUserArchiver() {
    this.userService.getAllUserArchiver().subscribe(
      (userArchiver: any) => {
        this.tabUserArchiver = userArchiver;
        this.tabUserNoArchiverFilter = this.tabUserArchiver;
      },
      (err) => {
      }
    )
  }

  desarchiver(paramUser: any) {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous débloquer cette utilisateur?',
      'Oui', 'Non', () => {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.userService.desarchiver(paramUser).subscribe(
        (response) => {
          Notify.success(response.message);
          this.listeUserArchiver();
          Loading.remove();
        }
      )
    });
  }

  updatePassword() {
    let pass={
      mot_de_passe_actuel: this.inputpassactuel,
      nouveau_mot_de_passe: this.inputpassnew
    }
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmation ',
      'Voullez-vous vous modifier Votre mot de passe?',
      'Oui', 'Non', () => {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.userService.password(pass).subscribe(
        (response) => {
          Notify.success(response.message);
          this.listeUserArchiver();
          Loading.remove();
        }
      )
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
