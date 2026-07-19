import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se existir um token salvo, clonamos a requisição e adicionamos o cabeçalho "Bearer"
  if (token) {
    const requisicaoClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(requisicaoClonada); // Envia a requisição com a chave
  }

  // Se não tiver token (ex: na própria tela de login), envia a requisição normal
  return next(req);
};