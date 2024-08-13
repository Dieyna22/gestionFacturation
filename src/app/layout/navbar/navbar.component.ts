import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';



// Définir l'interface pour la réponse du login et du rafraîchissement du token
interface AuthResponse {
  access_token: string;
  expires_in: number;
}

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

  

  constructor(private route: Router,private http: HttpClient) { }

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
        this.route.navigate(['/connexion']);
        Loading.remove();
      
      });
  }

    // Rafraîchir le token
    refreshToken(): Observable<AuthResponse> {
      return this.http
        .post<AuthResponse>(`http://127.0.0.1:8000/api/refresh-token`, {})
        .pipe(
          tap((response) => {
            // this.handleAuthResponse(response);
            console.log(response)
          }),
          catchError((error) => {
            this.logout(); // Déconnexion si l'échec de rafraîchissement
            return throwError(
              () => new Error('Échec du rafraîchissement du token')
            );
          })
        );
    }

}
