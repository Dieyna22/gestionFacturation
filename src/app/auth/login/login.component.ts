import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  //inscription
  nom: string = "";
  email: string = "";
  password: string = "";
  ConfPassword: string = "";
  // Variables pour faire la vérifications
  verifEmail: String = "";
  verifPass:  String = "";
  verifNom:  String = "";
  verifPassConf:  String = "";

  // Variables si les champs sont exacts
  exactEmail: boolean = false;
  exactPass:  boolean = false;
  exactNom:  boolean = false;
  exactPassConf:  boolean = false;

 

  ngOnInit() {
    if (!localStorage.getItem("userOnline")) {
      localStorage.setItem("userOnline", JSON.stringify(""))
    }
  }

  constructor(private route:Router,private authAdmin: AuthService){}

  // On vide tous les champs 
  viderChamps(){
    this.email = "";
    this.password = "";
  }

  // Inscriptions
  inscription(){
    let user = {
      "name":this.nom,
      "email": this.email,
      "password": this.password
    };
    this.authAdmin.inscription(user).subscribe(
      (reponse) => {
        alert(reponse);
        this.choixFormulaire = !this.choixFormulaire;
      },
      (error) => {
        alert(error);
      })
  }

    // connexion 
    connexion() {
      let user = {
        "email": this.emailLogin,
        "password": this.passwordLogin
      };

        // Connexion en tant qu'utilisateur normal
        this.authAdmin.connexionAdmin(user).subscribe(
          (response) => {
            alert(response);
            localStorage.setItem('userOnline', JSON.stringify(response));
            this.route.navigate(['/admin']);
          },
          (err) => {
            alert(err);
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
  }else if (this.passwordLogin.length < 6) {
    this.verifPass = "Le mot de passe doit contenir au moins six caractéres";
  }else {
    this.verifPass = "";
    this.exactPass = true;
  }
}

// Nom complet
verifNomFonction() {
  this.exactPass = false;
  const nameRegex=/^[a-zA-Z][a-zA-Z -]{1,100}$/;
  if (this.nom == "") {
    this.verifNom = "";
  }else if (!nameRegex.test(this.nom)) {
    this.verifNom = "Saisie incorrect";
  }else {
    this.verifNom = "";
    this.exactNom = true;
  }
}

// Email inscription
verifEmailInsFonction() {
  this.exactEmail = false;
  const emailRegex=/^[A-Za-z]+[A-Za-z0-9\._%+-]+@+[A-Za-z][A-Za-z0-9\.-]+\.[A-Za-z]{2,}$/;
  if (this.email == "") {
    this.verifEmail = "";
  }else if (!emailRegex.test(this.email)) {
    this.verifEmail = "Email incorrect'";
  }else {
    this.verifEmail = "";
    this.exactEmail = true;
  }
}

// Password de connexion
verifPassInsFonction() {
  this.exactPass = false;
  if (this.password == "") {
    this.verifPass = "";
  }else if (this.password.length < 6) {
    this.verifPass = "Le mot de passe doit contenir au moins six caractéres";
  }else {
    this.verifPass = "";
    this.exactPass = true;
  }
}

// Confimation mot de passe
verifPassConfFonction() {
  this.exactPassConf = false;
  if (this.password == "") {
    this.verifPassConf = "";
  }else if (this.ConfPassword.length < 6) {
    this.verifPassConf = "Le mot de passe doit contenir au moins six caractéres";
  }else if (this.password.toLowerCase() != this.ConfPassword.toLowerCase()) {
    this.verifPassConf = "Les deux mots de passe doivent etres indentiques";
  }else {
    this.verifPassConf = "";
    this.exactPassConf = true;
  }
}


}


