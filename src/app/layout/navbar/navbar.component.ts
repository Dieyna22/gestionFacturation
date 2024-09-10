import { ChangeDetectorRef, Component } from '@angular/core';
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
  usermail: string = '';



  constructor(private route: Router, private http: HttpClient,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]");
    this.nom = this.dbUsers.user.name;
    this.role = this.dbUsers.user.role;
    this.usernom = this.dbUsers.user.prenom;
    this.usermail = this.dbUsers.user.email;

  }

  logout() {
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Déconnexion',
      'Voullez-vous vous Déconnecter?',
      'Oui', 'Non', () => {
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

  sliderValue1: number = 10;
  sliderValue2: number = 7;
  sliderValue3: number = 7;
  sliderValue4: number = 7;
  sliderValue5: number = 7;

  updateSliderValue1(event: Event): void {
    this.sliderValue1 = (event.target as HTMLInputElement).valueAsNumber;
  }

  updateSliderValue2(event: Event): void {
    this.sliderValue2 = (event.target as HTMLInputElement).valueAsNumber;
  }

  updateSliderValue3(event: Event): void {
    this.sliderValue3 = (event.target as HTMLInputElement).valueAsNumber;
  }

  updateSliderValue4(event: Event): void {
    this.sliderValue4 = (event.target as HTMLInputElement).valueAsNumber;
  }

  updateSliderValue5(event: Event): void {
    this.sliderValue5 = (event.target as HTMLInputElement).valueAsNumber;
  }

  increaseValue1(): void {
    if (this.sliderValue1 < 99) {
      this.sliderValue1++;
    }
  }

  decreaseValue1(): void {
    if (this.sliderValue1 > 0) {
      this.sliderValue1--;
    }
  }

  increaseValue2(): void {
    if (this.sliderValue2 < 99) {
      this.sliderValue2++;
    }
  }

  decreaseValue2(): void {
    if (this.sliderValue2 > 0) {
      this.sliderValue2--;
    }
  }

  increaseValue3(): void {
    if (this.sliderValue3 < 99) {
      this.sliderValue3++;
    }
  }

  decreaseValue3(): void {
    if (this.sliderValue3 > 0) {
      this.sliderValue3--;
    }
  }

  increaseValue4(): void {
    if (this.sliderValue4 < 99) {
      this.sliderValue4++;
    }
  }

  decreaseValue4(): void {
    if (this.sliderValue4 > 0) {
      this.sliderValue4--;
    }
  }

  increaseValue5(): void {
    if (this.sliderValue5 < 99) {
      this.sliderValue5++;
    }
  }

  decreaseValue5(): void {
    if (this.sliderValue5 > 0) {
      this.sliderValue5--;
    }
  }

  isChecked = false;
  sliderValue = 0;
  isAfterChecked = false;
  afterSliderValue = 0;

  toggleCheck() {
    this.isChecked = !this.isChecked;
    this.cdr.detectChanges();
  }
  decreaseValue() {
    if (this.sliderValue > 0) {
      this.sliderValue--;
    }
  }

  increaseValue() {
    if (this.sliderValue < 99) {
      this.sliderValue++;
    }
  }

  updateSliderValue(event: Event) {
    this.sliderValue = parseInt((event.target as HTMLInputElement).value);
  }

  toggleAfterCheck() {
    this.isAfterChecked = !this.isAfterChecked;
    this.cdr.detectChanges();
  }

  decreaseAfterValue() {
    if (this.afterSliderValue > 0) {
      this.afterSliderValue--;
    }
  }

  increaseAfterValue() {
    if (this.afterSliderValue < 99) {
      this.afterSliderValue++;
    }
  }

  updateAfterSliderValue(event: Event) {
    this.afterSliderValue = parseInt((event.target as HTMLInputElement).value);
  }

}
