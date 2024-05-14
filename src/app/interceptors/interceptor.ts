import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userOnlineStr = localStorage.getItem('userOnline');

    // Assurez-vous que userOnlineStr n'est pas nul et n'est pas une chaîne vide
    if (userOnlineStr && userOnlineStr.trim() !== '') {
      const userOnline = JSON.parse(userOnlineStr);
      if (userOnline && userOnline.authorization.token!== undefined && userOnline.authorization.token!== null) {
        const token = userOnline.authorization.token;

        // Utilisez une condition appropriée pour vérifier si le token est défini
        if (token === undefined || token === null) {
          this.router.navigate(['/accueil']);
          return EMPTY; // Retourne un Observable vide
        }

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return next.handle(request);
  }
}

