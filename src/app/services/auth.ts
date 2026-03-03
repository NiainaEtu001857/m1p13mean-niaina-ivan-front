import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private API = `${environment.api}/auth`;

  login(data: {email: string; password: string})
  {
    return this.http.post(`${this.API}/login`, data);
  }

  register(data: { name: string; email: string; password: string})
  {
    return this.http.post(`${this.API}/register`, data);
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
  
}
