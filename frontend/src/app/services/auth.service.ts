import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioLogin, LoginResponse } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos o inject do Angular moderno para trazer o HttpClient
  private http = inject(HttpClient);
  
  // Essa é a URL base do backend do seu amigo (porta 5036, confirme se é essa mesma)
  private apiUrl = 'http://localhost:5036/api/auth'; 

  constructor() {}

  // Função que envia o usuário e senha para a API
  login(credenciais: UsuarioLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap(response => {
        // Se a API responder com sucesso, pegamos o Token e salvamos no LocalStorage
        localStorage.setItem('token', response.token);
      })
    );
  }

  // Pega o token salvo para podermos mandar nas rotas trancadas
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica se o usuário tem um token salvo (se está logado)
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Apaga o token ao sair do sistema
  logout(): void {
    localStorage.removeItem('token');
  }
}