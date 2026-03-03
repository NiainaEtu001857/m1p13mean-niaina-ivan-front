import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LogoutService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    logout(): void {
        // Appel au backend pour terminer la session
        this.http.post('/api/auth/logout', {}).subscribe(
            () => {
                // Nettoyer le localStorage/sessionStorage
                localStorage.removeItem('token');
                sessionStorage.clear();
                
                // Rediriger vers la page de connexion
                this.router.navigate(['/login']);
            },
            error => {
                console.error('Erreur lors de la déconnexion:', error);
                // Rediriger même en cas d'erreur
                this.router.navigate(['/login']);
            }
        );
    }
}