import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Report } from 'notiflix/build/notiflix-report-aio';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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

constructor(private route:Router,private authAdmin: AuthService){}

showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


 // On vide tous les champs 
 viderChamps(){
  this.email = "";
  this.password = "";
  this.nom="";
  this.ConfPassword="";
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
      Report.success('Notiflix Success',reponse.message,'Okay',);
      this.viderChamps();
      this.route.navigate(['connexion']);
    },
    (error) => {
    })
}


// validation des formulaires
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
  }else if (this.password.length < 8) {
    this.verifPass = "Le mot de passe doit contenir au moins huit caractéres";
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
    this.verifPassConf = "Le mot de passe doit contenir au moins huit caractéres";
  }else if (this.password.toLowerCase() != this.ConfPassword.toLowerCase()) {
    this.verifPassConf = "Les deux mots de passe doivent etres indentiques";
  }else {
    this.verifPassConf = "";
    this.exactPassConf = true;
  }
}

}
