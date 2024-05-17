import { Component } from '@angular/core';

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
  

  getFile(event: any) {
    this.profil = event.target.files[0] as File;
  }
}
