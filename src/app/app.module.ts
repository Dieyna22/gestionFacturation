import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './home/accueil/accueil.component';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/interceptor';
import { RoleComponent } from './admin/role/role.component';
import { UsersComponent } from './admin/users/users.component';
import { UserArchiverComponent } from './admin/user-archiver/user-archiver.component';
import { CategorieComponent } from './admin/categorie/categorie.component';
import { ClientsComponent } from './admin/clients/clients.component';
import { PromosComponent } from './admin/promos/promos.component';
import { ArticlesComponent } from './admin/articles/articles.component';
import { InfosComponent } from './admin/infos/infos.component';
import { RegisterComponent } from './auth/register/register.component';
import { CategorieArticleComponent } from './admin/categorie-article/categorie-article.component';
import { FactureComponent } from './admin/facture/facture.component';
import { NgxPrintModule } from 'ngx-print';
import { ServicesComponent } from './admin/services/services.component';
import { ModelComponent } from './admin/model/model.component';
import { CategorieServiceComponent } from './categorie-service/categorie-service.component';
import { GrilleTarifaireComponent } from './admin/grille-tarifaire/grille-tarifaire.component';
import { PayementComponent } from './admin/payement/payement.component';
import { DepenseComponent } from './admin/depense/depense.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    NavbarComponent,
    RoleComponent,
    UsersComponent,
    UserArchiverComponent,
    CategorieComponent,
    ClientsComponent,
    PromosComponent,
    ArticlesComponent,
    InfosComponent,
    RegisterComponent,
    CategorieArticleComponent,
    FactureComponent,
    ServicesComponent,
    ModelComponent,
    CategorieServiceComponent,
    GrilleTarifaireComponent,
    PayementComponent,
    DepenseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxPrintModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
