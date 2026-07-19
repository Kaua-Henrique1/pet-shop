import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_BASE}/Auth`;

  constructor(private http: HttpClient) { }

  register(credenciais: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credenciais);
  }

  private getStorage(): Storage | null {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage
      : null;
  }

  login(credenciais: any): Observable<any> {
    // Envia o { login, senha } para o endpoint
    return this.http.post(`${this.apiUrl}/login`, credenciais).pipe(
      tap((resposta: any) => {
        const token = resposta?.token ?? resposta;
        const storage = this.getStorage();
        if (storage && token) {
          storage.setItem('token', token);
        }
      })
    );
  }

  getToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem('token') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    const storage = this.getStorage();
    storage?.removeItem('token');
  }
}