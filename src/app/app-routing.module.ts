import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AccueilComponent } from './home/accueil/accueil.component';

const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component:AccueilComponent , title: 'Accueil' },
  { path: 'connexion', component: LoginComponent, title: 'Connexion' },
  { path: 'admin', component: DashboardComponent, title: 'Admin'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
