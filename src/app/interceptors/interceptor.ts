import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userOnlineStr = localStorage.getItem('userOnline');

    // Éviter d'ajouter le token si la requête concerne la connexion
    if (request.url.includes('/login')) {
      return next.handle(request);
    }

    // Continuer si un token existe dans le localStorage
    if (userOnlineStr) {
      const userOnline = JSON.parse(userOnlineStr);
      const token = userOnline?.authorization?.token;

      if (token) {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true
        });
      } else {
        console.log("Aucun token trouvé, redirection vers la page de connexion.");
        this.router.navigate(['']); // Rediriger vers la connexion si le token est manquant
        return EMPTY;
      }
    }

    // Gérer les réponses et les erreurs
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Vérifier si l'erreur est liée à l'authentification (401)
        if (error.status === 401) {
          console.error("Erreur 401 : Accès non autorisé");
          Notify.failure('Session Expirer !!!', {
            position: 'center-center', // Positionner au centre
        });
          this.router.navigate(['']); // Rediriger vers la connexion pour une erreur 401
        }
        // Détecter les erreurs CORS ou les problèmes réseau (statut 0)
        if (error.status === 0) {
          console.error("Erreur CORS ou problème réseau détecté");
        }
        // Retourner l'erreur après le traitement
        return throwError(error);
      })
    );
  }
}
