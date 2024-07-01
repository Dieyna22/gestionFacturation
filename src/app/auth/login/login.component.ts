import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  choixFormulaire: boolean = true;
  public afficherFormulaire() {
    this.choixFormulaire = !this.choixFormulaire;
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

   // Nos attributs
  //connexion
  emailLogin: string = "";
  passwordLogin: string = "";
 

  // Variables pour faire la vérifications
  verifEmail: String = "";
  verifPass:  String = "";
  

  // Variables si les champs sont exacts
  exactEmail: boolean = false;
  exactPass:  boolean = false;

  ngOnInit() {
    if (!localStorage.getItem("userOnline")) {
      localStorage.setItem("userOnline", JSON.stringify(""))
    }
  }

  constructor(private route:Router,private authAdmin: AuthService){}

  // On vide tous les champs 
  viderChamps(){
    this.emailLogin = "";
    this.passwordLogin = "";
  }


    // connexion 
    connexion() {
      let user = {
        "email": this.emailLogin,
        "password": this.passwordLogin
      };
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();

        // Connexion en tant qu'admin
        this.authAdmin.connexionAdmin(user).subscribe(
          (response) => {
            Notify.success('connexion reussie');
            localStorage.setItem('userOnline', JSON.stringify(response));
            this.route.navigate(['/admin']);
            Loading.remove();
          },
          (err) => {
            // Connexion en tant qu'utilisateur normal
        this.authAdmin.connexionUser(user).subscribe(
          (response) => {
            Notify.success('connexion reussie');
            localStorage.setItem('userOnline', JSON.stringify(response));
            this.route.navigate(['/admin']);
            Loading.remove();
          },
          (err) => {
            Notify.failure(err.error.message);
            Loading.remove();
          }
        )
          }
        );


      }

// validation des formulaires
// Email de connexion
verifEmailFonction() {
  this.exactEmail = false;
  const emailRegex=/^[A-Za-z]+[A-Za-z0-9\._%+-]+@+[A-Za-z][A-Za-z0-9\.-]+\.[A-Za-z]{2,}$/;
  if (this.emailLogin == "") {
    this.verifEmail = "";
  }else if (!emailRegex.test(this.emailLogin)) {
    this.verifEmail = "Email incorrect'";
  }else {
    this.verifEmail = "";
    this.exactEmail = true;
  }
}

// Password de connexion
verifPassFonction() {
  this.exactPass = false;
  if (this.passwordLogin == "") {
    this.verifPass = "";
  }else if (this.passwordLogin.length < 8) {
    this.verifPass = "Le mot de passe doit contenir au moins huit caractéres";
  }else {
    this.verifPass = "";
    this.exactPass = true;
  }
}



}


