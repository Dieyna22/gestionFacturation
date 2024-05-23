import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  dbUsers: any;
  nom: string = '';
  role: string = '';
  usernom: string = '';

  

  constructor(private route: Router) { }

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.nom = this.dbUsers.user.name  
    this.role = this.dbUsers.user.role
    this.usernom = this.dbUsers.user.prenom

  }

  logout() {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Déconnexion',
    'Voullez-vous vous Déconnecter?',
    'Oui','Non',() => 
      {
        Loading.init({
          svgColor: '#5C6FFF',
        });
        Loading.hourglass();
        localStorage.removeItem('userOnline');
        this.route.navigate(['/accueil']);
        Loading.remove();
      
      });
  }

}
