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
import { CommandeDachatComponent } from './admin/commande-dachat/commande-dachat.component';
import { ComptableComponent } from './admin/comptable/comptable.component';
import { RapportComponent } from './admin/rapport/rapport.component';
import { StockComponent } from './admin/stock/stock.component';
import {  UsersGuard } from './services/guard';

const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  // { path: 'accueil', component:AccueilComponent , title: 'Accueil' },
  { path: 'register', component: RegisterComponent, title: 'Inscription' },
  { path: 'connexion', component: LoginComponent, title: 'Connexion' },
  { path: 'admin', component: DashboardComponent, title: 'Admin', canActivate: [UsersGuard]},
  { path: 'role', component: RoleComponent, title: 'Role' , canActivate: [UsersGuard]},
  { path: 'user', component: UsersComponent, title: 'Utilisateurs' , canActivate: [UsersGuard]},
  { path: 'userArchive', component: UserArchiverComponent, title: 'Utilisateurs Archiver' , canActivate: [UsersGuard]},
  { path: 'categorie', component: CategorieComponent, title: 'Categories' , canActivate: [UsersGuard]},
  { path: 'client', component: ClientsComponent, title: 'Clients' , canActivate: [UsersGuard]},
  { path: 'promo', component: PromosComponent, title: 'Promo' , canActivate: [UsersGuard]},
  { path: 'article', component: ArticlesComponent, title: 'Produits' , canActivate: [UsersGuard]},
  { path: 'service', component: ServicesComponent, title: ' Services' , canActivate: [UsersGuard]},
  { path: 'infos', component: InfosComponent, title: 'Informations supplémentaire' , canActivate: [UsersGuard]},
  { path: 'facture', component: FactureComponent, title: 'Factures ' , canActivate: [UsersGuard]},
  { path: 'model', component: ModelComponent, title: 'Modéle de document ' , canActivate: [UsersGuard]},
  { path: 'grille', component: GrilleTarifaireComponent, title: 'grille tarifaire' , canActivate: [UsersGuard]},
  { path: 'payement', component: PayementComponent, title: 'Payement' , canActivate: [UsersGuard]},
  { path: 'depense', component: DepenseComponent, title: 'depense' , canActivate: [UsersGuard]},
  { path: 'achat', component: CommandeDachatComponent, title: 'commande d"achat' , canActivate: [UsersGuard]},
  { path: 'comptable', component: ComptableComponent, title: 'configuration comptable' , canActivate: [UsersGuard]},
  { path: 'rapport', component: RapportComponent, title: 'Rapports' , canActivate: [UsersGuard]},
  { path: 'stock', component: StockComponent, title: 'stock' , canActivate: [UsersGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
