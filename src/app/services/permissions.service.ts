import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private permissionsSubject = new BehaviorSubject<boolean>(false);
  permissions$ = this.permissionsSubject.asObservable();

  // Déclarer des variables pour chaque permission
  canAccessReport: boolean = false;
  canExportExcel: boolean = false;
  canManageStock: boolean = false;
  canVisibiliteGlobale: boolean = false;
  canDeleteData: boolean = false;
  canFonctionAdmin: boolean = false;
  isAdmin: boolean = false;

  constructor() {
    this.loadPermissions();
  }

  // Charger les permissions depuis le localStorage
   loadPermissions(): void {
    const user = localStorage.getItem('userOnline');
    // if (user) {
    //   const userData = JSON.parse(user);
    //   console.log(userData.user)
    //   this.canAccessReport = userData.user.acces_rapport === 1 || userData.user.acces_rapport === "1";
    //   this.canExportExcel = userData.user.export_excel === 1 || userData.user.export_excel === "1";
    //   this.canManageStock = userData.user.gestion_stock === 1 || userData.user.gestion_stock === "1";
    //   this.canVisibiliteGlobale = userData.user.visibilite_globale === 1 || userData.user.archiver === "1";
    //   this.canDeleteData = userData.user.supprimer_donnees === 1 || userData.user.supprimer_donnees === "1";
    //   this.canFonctionAdmin = userData.user.fonction_admin === 1 || userData.user.fonction_admin === "1";
    //   this.isAdmin = userData.user.role == "super_admin";
    //   console.log('User Role:', userData.user.role);
    //   console.log('Is Admin:', this.isAdmin);
    // }

  }

  // Méthodes pour accéder aux permissions
  hasPermission(permission: string): boolean {
    switch (permission) {
      case 'acces_rapport':
        return this.canAccessReport;
      case 'export_excel':
        return this.canExportExcel;
      case 'gestion_stock':
        return this.canManageStock;
      case 'visibilite_globale':
        return this.canVisibiliteGlobale;
      case 'supprimer_donnees':
        return this.canDeleteData;
      case 'fonction_admin':
        return this.canFonctionAdmin;
      case 'role':
        return this.isAdmin;
      default:
        return false;
    }
  }
}
