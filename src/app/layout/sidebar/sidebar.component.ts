import { Component } from '@angular/core';

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

  ngOnInit() {
    // Renvoie un tableau de valeurs ou un tableau vide 
    this.dbUsers = JSON.parse(localStorage.getItem("userOnline") || "[]"); 
    this.role = this.dbUsers.user.role

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

  }
}
