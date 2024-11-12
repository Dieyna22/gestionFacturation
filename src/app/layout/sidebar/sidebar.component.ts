import { Component } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  dbUsers: any;
  role: string = ''

  constructor(private configService:ConfigurationService) { }

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
    this.role = this.dbUsers.token.user.role

    if (this.role == "super_admin") {
      this.isSuperAdmin = true;
      this.isAdmin = false;
      this.isUser = false;
    } else if (this.role == "administrateur") {
      this.isSuperAdmin = false;
      this.isAdmin = true;
      this.isUser = false;
    }else if (this.role == "utilisateur_simple") {
      this.isSuperAdmin = false;
      this.isAdmin = false;
      this.isUser = true;
    }

    this.listeHistorique();
    this.listeNotification();
  }

    isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  tabHistory:any[]=[];
  listeHistorique(){
    this.configService.getHistory().subscribe(
      (response)=>{
        this.tabHistory = response;
        console.log(this.tabHistory);
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  tabNotification:any[]=[];
  listeNotification(){
    this.configService.getNotification().subscribe(
      (response)=>{
        this.tabNotification = response;
        console.log(this.tabNotification);
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  supprimerNotif(messageValue:any){
    let notifMessage ={
      message:messageValue,
    }
    Confirm.init({
      okButtonBackground: '#FF1700',
      titleColor: '#FF1700'
    });
    Confirm.show('Confirmer supprimession ',
      'Voullez-vous supprimer?',
      'Oui', 'Non', () => {
        Loading.init({
          svgColor: '#FF1700',
        });
        Loading.hourglass();
        this.configService.deleteNotification(notifMessage).subscribe(
          (reponse) => {
            console.log(reponse);
            Notify.success(reponse.message);
            Loading.remove();
            this.listeNotification()
          }
        );
      });
  }

}
