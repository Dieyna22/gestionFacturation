import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AccueilComponent } from './home/accueil/accueil.component';
import { RoleComponent } from './admin/role/role.component';
import { UsersComponent } from './admin/users/users.component';
import { UserArchiverComponent } from './admin/user-archiver/user-archiver.component';
import { CategorieComponent } from './admin/categorie/categorie.component';
import { ClientsComponent } from './admin/clients/clients.component';
import { PromosComponent } from './admin/promos/promos.component';
import { ArticlesComponent } from './admin/articles/articles.component';
import { InfosComponent } from './admin/infos/infos.component';
import { RegisterComponent } from './auth/register/register.component';
import { FactureComponent } from './admin/facture/facture.component';
import { ServicesComponent } from './admin/services/services.component';
import { ModelComponent } from './admin/model/model.component';
import { GrilleTarifaireComponent } from './admin/grille-tarifaire/grille-tarifaire.component';
import { PayementComponent } from './admin/payement/payement.component';
import { DepenseComponent } from './admin/depense/depense.component';

const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  // { path: 'accueil', component:AccueilComponent , title: 'Accueil' },
  { path: 'register', component: RegisterComponent, title: 'Inscription' },
  { path: 'connexion', component: LoginComponent, title: 'Connexion' },
  { path: 'admin', component: DashboardComponent, title: 'Admin'},
  { path: 'role', component: RoleComponent, title: 'Role'},
  { path: 'user', component: UsersComponent, title: 'Utilisateurs'},
  { path: 'userArchive', component: UserArchiverComponent, title: 'Utilisateurs Archiver'},
  { path: 'categorie', component: CategorieComponent, title: 'Categories'},
  { path: 'client', component: ClientsComponent, title: 'Clients'},
  { path: 'promo', component: PromosComponent, title: 'Promo'},
  { path: 'article', component: ArticlesComponent, title: 'Produits'},
  { path: 'service', component: ServicesComponent, title: ' Services'},
  { path: 'infos', component: InfosComponent, title: 'Informations supplémentaire'},
  { path: 'facture', component: FactureComponent, title: 'Factures '},
  { path: 'model', component: ModelComponent, title: 'Modéle de document '},
  { path: 'grille', component: GrilleTarifaireComponent, title: 'grille tarifaire'},
  { path: 'payement', component: PayementComponent, title: 'Payement'},
  { path: 'depense', component: DepenseComponent, title: 'depense'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
