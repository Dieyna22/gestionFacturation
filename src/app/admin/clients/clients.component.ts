import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { ClientsService } from 'src/app/services/clients.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

// Gestion bouton
boutonActif=1;

// Initialiser le contenu actuel
currentContent: string = 'categorie';

// Mettre à jour le contenu actuel
showComponant(contentId: string): void {
  this.currentContent = contentId; 
}

// Déclaration des variables 
tabClient: any[] = [];
tabClientFilter: any[] = [];
tabCategorie: any[] = [];

filterValue: string = "";
prenom: string = "";
nom: string = "";
mail: string = "";
typeClient: string = "";
entreprise: string = "";
adress: string = "";
telephone: string = "";
statut: string = "";
type: string = "";
paysClient: string = "";
villeClient: string = "";
fiscal: string = "";
nomDestinataire: string = "";
postal: string = "";
paysLivraison: string = "";
villeLivraison: string = "";
telDestinataire: string = "";
emailDestinataire: string = "";
infos: string = "";
notes: string = ""; 


inputprenom: string = "";
inputnom: string = "";
inputmail: string = "";
inputEntreprise: string = "";
inputClient: string = "";
inputAdress: string = "";
inputTelephone: string = "";
inputstatut: string = "";
inputtype: string = "";
inputpaysClient: string = "";
inputvilleClient: string = "";
inputfiscal: string = "";
inputnomDestinataire: string = "";
inputpostal: string = "";
inputpaysLivraison: string = "";
inputvilleLivraison: string = "";
inputtelDestinataire: string = "";
inputemailDestinataire: string = "";
inputinfos: string = "";
inputnotes: string = "";



constructor(private http: HttpClient, private ServiceCategorie: CategorieService, private clientService:ClientsService) { }


showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

ngOnInit(): void {
 this.listeCategorie();
 this.listeClients();
}

listeCategorie() {
 this.ServiceCategorie.getAllCategorie().subscribe(
   (categories: any) => {
     this.tabCategorie = categories.CategorieClient;
   },
   (err) => {
   }
 )
}


ajouterUsers(){
 let clients={
   "nom_client":this.nom,
   "prenom_client":this.prenom,
   "nom_entreprise":this.entreprise,
   "adress_client":this.adress,
   "email_client":this.mail,
   "tel_client":this.telephone,
   "categorie_id":this.typeClient,
   "statut_client":this.statut,
   "type_client":this.type,
   "pays_client":this.paysClient,
   "ville_client":this.villeClient,
   "num_id_fiscal":this.fiscal,
   "nom_destinataire":this.nomDestinataire,
   "code_postal_livraison":this.postal,
   "pays_livraison":this.paysLivraison,
   "ville_livraison":this.villeLivraison,
   "tel_destinataire":this.telDestinataire,
   "email_destinataire":this.emailDestinataire,
   "infoSupplemnt":this.infos,
   "noteInterne_client":this.notes,

 }
 this.clientService.addClient(clients).subscribe(
   (client:any)=>{
    Report.success('Notiflix Success',client.message,'Okay',);
     this.vider();
     this.listeClients();
   },
   (err) => {
   }
 )
}

listeClients() {
 this.clientService.getAllClients().subscribe(
   (clients: any) => {
     this.tabClient = clients;
     this.tabClientFilter = this.tabClient;
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
 this.typeClient='';
 this.entreprise='';
 this.adress='';
 this.telephone='';
 this.statut='';
 this.type='';
 this.paysClient='';
 this.villeClient='';
 this.fiscal='';
 this.nomDestinataire='';
 this.postal='';
 this.paysLivraison='';
 this.villeLivraison='';
 this.telDestinataire='';
 this.emailDestinataire='';
 this.infos='';
 this.notes='';

 this.inputnom='';
 this.inputprenom='';
 this.inputmail='';
 this.inputEntreprise='';
 this.inputClient='';
 this.inputTelephone='';
 this.inputAdress='';
 this.inputstatut='';
 this.inputtype='';
 this.inputpaysClient='';
 this.inputvilleClient='';
 this.inputfiscal='';
 this.inputnomDestinataire='';
 this.inputpostal='';
 this.inputpaysLivraison='';
 this.inputvilleLivraison='';
 this.inputtelDestinataire='';
 this.inputemailDestinataire='';
 this.inputinfos='';
 this.inputnotes='';

}

deleteClient(paramClient:any){
  Confirm.init({
    okButtonBackground: '#FF1700',
    titleColor: '#FF1700'
  });
  Confirm.show('Confirmer Suppression ',
  'Voullez-vous supprimer?',
  'Oui','Non',() => 
    {
      Loading.init({
        svgColor: '#5C6FFF',
      });
      Loading.hourglass();
      this.clientService.deleteClient(paramClient).subscribe(
        (response)=>{
         Notify.success(response.message);
          this.listeClients();
          Loading.remove();
        }
      )
    });
}

currentClient: any;
// Methode pour charger les infos du zone  à modifier
chargerInfosClient(paramClient:any){
 this.currentClient = paramClient;
 console.log(paramClient);
 this.inputnom = paramClient.nom_client;
 this.inputprenom = paramClient.prenom_client;
 this.inputmail = paramClient.email_client;
 this.inputClient = paramClient.categorie_id;
 this.inputEntreprise =paramClient.nom_entreprise;
 this.inputTelephone = paramClient.tel_client;
 this.inputAdress = paramClient.adress_client;
 this.inputstatut = paramClient.statut_client;
 this.inputtype = paramClient.type_client;
 this.inputpaysClient = paramClient.pays_client;
 this.inputvilleClient = paramClient.ville_client;
 this.inputfiscal = paramClient.num_id_fiscal;
 this.inputnomDestinataire = paramClient.nom_destinataire;
 this.inputpostal = paramClient.code_postal_livraison;
 this.inputpaysLivraison = paramClient.pays_livraison;
 this.inputvilleLivraison = paramClient.ville_livraison;
 this.inputtelDestinataire = paramClient.tel_destinataire;
 this.inputemailDestinataire = paramClient.email_destinataire;
 this.inputinfos = paramClient.infoSupplemnt;
 this.inputnotes = paramClient.noteInterne_client;

}

updateUser() {
  let clients={
    "nom_client":this.inputnom,
    "prenom_client":this.inputprenom,
    "nom_entreprise":this.inputEntreprise,
    "adress_client":this.inputAdress,
    "email_client":this.inputmail,
    "tel_client":this.inputTelephone,
    "categorie_id":this.inputClient,
    "statut_client":this.inputstatut,
    "type_client":this.inputtype,
    "pays_client":this.inputpaysClient,
    "ville_client":this.inputvilleClient,
    "num_id_fiscal":this.inputfiscal,
    "nom_destinataire":this.inputnomDestinataire,
    "code_postal_livraison":this.inputpostal,
    "pays_livraison":this.inputpaysLivraison,
    "ville_livraison":this.inputvilleLivraison,
    "tel_destinataire":this.inputtelDestinataire,
    "email_destinataire":this.inputemailDestinataire,
    "infoSupplemnt":this.inputinfos,
    "noteInterne_client":this.inputnotes,
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
      this.clientService.updateClient(this.currentClient.id,clients).subscribe(
        (reponse)=>{
         Notify.success(reponse.message);
          this.listeClients();
          this.vider();
          Loading.remove();
        }
      )
    });
} 

// Methode de recherche automatique pour un utilisateur
onSearch() {
 // Recherche se fait selon le nom ou le prenom 
 this.tabClientFilter = this.tabClient.filter(
   (elt: any) => (elt?.nom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.prenom_client.toLowerCase().includes(this.filterValue.toLowerCase()) || elt?.nom_entreprise.toLowerCase().includes(this.filterValue.toLowerCase()))
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
 return this.tabClientFilter.slice(indexDebut, indexFin);
}

// Méthode pour générer la liste des pages
get pages(): number[] {
 const totalPages = Math.ceil(this.tabClientFilter.length / this.itemsParPage);
 return Array(totalPages).fill(0).map((_, index) => index + 1);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
 return Math.ceil(this.tabClientFilter.length / this.itemsParPage);
}

showChampsAddressPrincipal: boolean=false;
showChampsAddressLivraison: boolean=false;
showChampsOther: boolean=false;
currentStep = 1;
isFileValid = false;
afficherChampsAddressPrincipal(){
 this.showChampsAddressPrincipal=!this.showChampsAddressPrincipal;
}

afficherChampsAddressLivraison(){
  this.showChampsAddressLivraison=!this.showChampsAddressLivraison;
 }

 afficherChampsOther(){
  this.showChampsOther=!this.showChampsOther;
 }

 goToNextStep() {
  this.currentStep++;
}

downloadModel() {
  // Création du modèle de données
  const modelData = [
    {  prenom: '', nom: '', Nom_entreprise: '', type_client: '', Statut_client: '' , email_client: '', adress_client: '', num_id_fiscal: '', 
    Adresse_Code_postal : '', ville_client: '', pays_client: '', tel_client : '', noteInterne_client : '', nom_destinataire: '', pays_livraison: '',
    ville_livraison : '', code_postal_livraison : '', tel_destinataire : '', email_destinataire: '',  infoSupplemnt : '',
    }
  ];

  // Création de la feuille de calcul
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modelData);

  // Définition d'une largeur uniforme pour toutes les colonnes
  const columnWidth = 20; // Largeur en caractères

 
    // Application de la largeur à toutes les colonnes utilisées
    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const columnCount = range.e.c + 1; // Nombre de colonnes

      worksheet['!cols'] = Array(columnCount).fill({ wch: columnWidth });
    } else {
      // Fallback si !ref n'est pas défini (ce qui est peu probable dans ce cas)
      const columnCount = Object.keys(modelData[0]).length;
      worksheet['!cols'] = Array(columnCount).fill({ wch: columnWidth });
    }


  // Création du classeur
  const workbook: XLSX.WorkBook = { 
    Sheets: { 'Clients': worksheet }, 
    SheetNames: ['Clients'] 
  };

  // Conversion du classeur en buffer
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Sauvegarde du fichier
  this.saveAsExcelFile(excelBuffer, "modele_ajoutClients");
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  // Création d'un Blob à partir du buffer
  const data: Blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  // Création d'un lien de téléchargement
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = window.URL.createObjectURL(data);
  link.download = `${fileName}.xlsx`;

  // Simulation du clic pour déclencher le téléchargement
  link.click();

  // Nettoyage
  setTimeout(() => {
    window.URL.revokeObjectURL(link.href);
    link.remove();
  }, 100);
}

 private file: File | null = null;
 modelHeaders: string[] = [];
 

 onFileChange(event: any) {
  this.file = event.target.files[0];
  this.isFileValid = true; 
}

uploadFile() {
  if (this.file) {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);

    this.http.post('http://127.0.0.1:8000/api/importClient', formData).subscribe(
      response => {this.goToNextStep(); this.listeClients()},
      error => console.error('Erreur d\'importation', error)
    );
  }
  
}

exportExcel() {
  this.clientService.exportToExcel().subscribe(
    (data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    (err)=> {
      console.log(err);
    }
    
  );
}

}