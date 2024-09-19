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

  // profil: any;
  nom: string = '';
  tel: string = '';
  adress: string = '';
  desc: string = '';
  selectedLangue:string = '';
  

  Inputprofil: any;
  Inputnom: string = '';
  Inputtel: string = '';
  Inputadress: string = '';
  Inputdesc: string = ''

  InfoSup: any;
  

  profil: File | null = null;
  Signature: File | null = null;
  fileName: string = '';

  getFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné:', file); 
      this.profil = file;
      console.log(this.profil)
    } else {
      console.log('Aucun fichier sélectionné'); 
    }
  }

  getFileSignature(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné:', file); 
      this.Signature = file;
      console.log(this.Signature)
    } else {
      console.log('Aucun fichier sélectionné'); 
    }
  }

  getFileInputProfil(event: any) {
    this.Inputprofil = event.target.files[0] as File;
    console.log(this.Inputprofil.name)
  }

  constructor(private http: HttpClient, private userService:UtilisateurService) { }

  ngOnInit(): void {
    this.listeInfoSup();
  }

  ajouterInfoSup(){
    console.log(this.selectedLangue)
    let formData = new FormData();
    if (this.profil) {
      formData.append('logo', this.profil, this.profil.name);
    }
    formData.append("nom_entreprise", this.nom);
    formData.append("adress_entreprise", this.adress);
    formData.append("tel_entreprise", this.tel);
    formData.append("description_entreprise", this.desc);
    formData.append("devise", this.selectedCurrency);
    formData.append("langue", this.selectedLangue);
    if (this.Signature) {
      formData.append('signature', this.Signature, this.Signature.name);
    }


    this.userService.addInfoSup(formData).subscribe(
      (user:any)=>{
        Report.success('Notiflix Success',user.message,'Okay',);
        this.vider();
        this.listeInfoSup();
        console.log(this.profil)
      },
      (err) => {
      }
    )
  }

  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup=infoSup.user;
        console.log(this.InfoSup)
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
    this.Inputadress = this.InfoSup.adresse_entreprise;
    this.selectedCurrency = this.InfoSup.devise;
    this.selectedLangue = this.InfoSup.langue;
    this.Signature = this.InfoSup.signature;
  }

  updateInfoSup(){
    let formData = new FormData();
    formData.append("logo", this.Inputprofil);
    formData.append("nom_entreprise", this.Inputnom);
    formData.append("adress_entreprise", this.Inputadress);
    formData.append("tel_entreprise", this.Inputtel);
    formData.append("description_entreprise", this.Inputdesc);
    formData.append("devise", this.selectedCurrency);
    formData.append("langue", this.selectedLangue);
    if (this.Signature) {
      formData.append('signature', this.Signature, this.Signature.name);
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
        this.userService.updateInfoSup(formData).subscribe(
          (reponse)=>{
            this.listeInfoSup();
            this.vider();
            Notify.success(reponse.message);
            Loading.remove();
            console.log(this.Inputprofil)
          }
        );
      });
  }

   // méthode pour vider les champs
   vider(){
    this.nom='';
    this.profil=null;
    this.tel='';
    this.adress='';
    this.desc='';

    this.Inputnom='';
    this.Inputprofil='';
    this.Inputtel='';
    this.Inputadress='';
    this.Inputdesc='';

    this.selectedCurrency = '';
    this.selectedLangue = '';
    this.Signature=null;
  }

  currencies = [
    { code: 'XOF', name: 'Franc CFA (UEMOA)' },
    { code: 'USD', name: 'Dollar américain' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Livre sterling' },
    { code: 'JPY', name: 'Yen japonais' },
    { code: 'CAD', name: 'Dollar canadien' },
    { code: 'AUD', name: 'Dollar australien' },
    { code: 'CHF', name: 'Franc suisse' },
    { code: 'CNY', name: 'Yuan chinois' },
    { code: 'GNF', name: 'Franc guinéen' },
    { code: 'XAF', name: 'Franc CFA (CEMAC)' },
    { code: 'MAD', name: 'Dirham marocain' },
    { code: 'TND', name: 'Dinar tunisien' },
    { code: 'DZD', name: 'Dinar algérien' },
    { code: 'ZAR', name: 'Rand sud-africain' },
    { code: 'NGN', name: 'Naira nigérian' },
    { code: 'EGP', name: 'Livre égyptienne' },
    { code: 'KES', name: 'Shilling kényan' },
    { code: 'GHS', name: 'Cedi ghanéen' },
    { code: 'ETB', name: 'Birr éthiopien' },
    { code: 'UGX', name: 'Shilling ougandais' },
    { code: 'TZS', name: 'Shilling tanzanien' },
    { code: 'RWF', name: 'Franc rwandais' },
    { code: 'ZMW', name: 'Kwacha zambien' },
    { code: 'MUR', name: 'Roupie mauricienne' },
  ];

  selectedCurrency: string = '';

  onCurrencyChange() {
    console.log('Devise sélectionnée :', this.selectedCurrency);
    // Ici, vous pouvez ajouter la logique pour gérer le changement de devise
  }

  languages = [
    { code: 'Français', name: 'Français' },
    { code: 'English', name: 'English' },
    { code: 'Español', name: 'Español' }
  ];

  onLangueChange() {
    console.log('Langue sélectionnée :', this.selectedLangue);
    // Ici, vous pouvez ajouter la logique pour gérer le changement de devise
  }


}
