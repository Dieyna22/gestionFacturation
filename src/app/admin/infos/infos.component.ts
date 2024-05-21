import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio'

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {

  profil: any;
  nom: string = '';
  tel: string = '';
  adress: string = '';
  desc: string = '';

  Inputprofil: any;
  Inputnom: string = '';
  Inputtel: string = '';
  Inputadress: string = '';
  Inputdesc: string = ''

  InfoSup: any;
  

  getFile(event: any) {
    this.profil = event.target.files[0] as File;
  }

  getFileInputProfil(event: any) {
    this.Inputprofil = event.target.files[0] as File;
  }

  constructor(private http: HttpClient, private userService:UtilisateurService) { }

  ngOnInit(): void {
    this.listeInfoSup();
  }

  ajouterInfoSup(){
    let formData = new FormData();
    formData.append("logo", this.profil);
    formData.append("nom_entreprise", this.nom);
    formData.append("adress_entreprise", this.adress);
    formData.append("tel_entreprise", this.tel);
    formData.append("description_entreprise", this.desc);

    this.userService.addInfoSup(formData).subscribe(
      (user:any)=>{
        Report.success('Notiflix Success',user.message,'Okay',);
        this.vider();
        this.listeInfoSup();
      },
      (err) => {
      }
    )
  }

  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup=infoSup.user;
      },
      (err) => {
      }
    )
  }

  //Méthode pour charger les informations du trajets à modifier
  chargerInfoSup() {
    this.Inputprofil = this.InfoSup.logo;
    this.Inputnom = this.InfoSup.nom_entreprise;
    this.Inputtel = this.InfoSup.tel_entreprise;
    this.Inputdesc = this.InfoSup.description_entreprise;
    this.Inputadress = this.InfoSup.adress_entreprise;
  }

  updateInfoSup(){
    let formData = new FormData();
    formData.append("logo", this.Inputprofil);
    formData.append("nom_entreprise", this.Inputnom);
    formData.append("adress_entreprise", this.Inputadress);
    formData.append("tel_entreprise", this.Inputtel);
    formData.append("description_entreprise", this.Inputdesc);
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
        this.userService.updateInfoSup(formData).subscribe(
          (reponse)=>{
            this.listeInfoSup();
            this.vider();
            Notify.success(reponse.message);
            Loading.remove();
          }
        );
      });
  }

   // méthode pour vider les champs
   vider(){
    this.nom='';
    this.profil='';
    this.tel='';
    this.adress='';
    this.desc='';

    this.Inputnom='';
    this.Inputprofil='';
    this.Inputtel='';
    this.Inputadress='';
    this.Inputdesc='';
  }
}
