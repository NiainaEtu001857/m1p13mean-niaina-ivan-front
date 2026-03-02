import { Injectable } from '@angular/core';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Shop } from '../../interface/shops.interface';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try{
       this.currentUserSubject.next(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  async registerClient(clientData: { first_name: string; last_name: string;email: string; password: string; }): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token?: string; user?: User}>(
          `${environment.api}/client/create`,
          clientData
        )
      ); 

      if (!response.token || !response.user) {
        throw new Error('Réponse invalide du serveur');
      }
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }


  async login(email: string, password: string, role: 'CLIENT' | 'SHOP' | 'ADMIN'): Promise<void> {
    try {
      if (!email || !password) {
        alert('Please fill all required fields');
        return;
      }

      let response: { token?: string; user?: User };

      if (role === 'CLIENT') {
        response = await firstValueFrom(
          this.http.post<{ token?: string; user?: User }>(
            `${environment.api}/client/login`,
            { email, password }
          )
        );
      } else if (role === 'SHOP') {
        response = await firstValueFrom(
          this.http.post<{ token?: string; user?: User }>(
            `${environment.api}/shop/login`,
            { email, password }
          )
        );
      } else if (role === 'ADMIN') {
        response = await firstValueFrom(
          this.http.post<{ token?: string; user?: User }>(
            `${environment.api}/admin/login`,
            { email, password }
          )
        );
      } else {
        alert('Invalid role selected');
        return;
      }

      if (!response.token || !response.user) {
        throw new Error('Réponse invalide du serveur');
      }

      localStorage.setItem('token', response.token);
      console.log(localStorage.getItem('token'));
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem("id" , response.user.id);
      console.log(localStorage.getItem("id"));
      

      this.currentUserSubject.next(response.user);

    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }

  async registerShop(shopData: FormData): Promise<void> {
    try {

        const response = await firstValueFrom(
        this.http.post<{ token?: string; user?: User }>(
         `${environment.api}/shop/create`, 
          shopData
        )
      );

      if (!response.token || !response.user) {
        throw new Error('Réponse invalide du serveur');
      }

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      console.log(response);    
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  } 

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  private handleHttpError(error: unknown)
  { 
    if (error instanceof HttpErrorResponse)
      {
        if (error.status === 0)
          throw new Error('Erreur réseau : impossible de joindre le serveur');
        throw new Error(error.error?.message || 'Erreur serveur');
      }
      if(error instanceof Error)
      {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue');
  }
}
