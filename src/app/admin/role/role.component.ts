import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

  inputrole:string="" 

  constructor(private http: HttpClient, private role: RoleService) { }

  ajouterZone() {
    let role ={
      "role":this.inputrole
    }

    this.role.addRole(role).subscribe(
      (response) => {
      alert(response);
    }
  );
  }

}
