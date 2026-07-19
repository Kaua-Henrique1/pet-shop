import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho se necessário

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let token: string | null = null;
  try {
    token = authService.getToken();
  } catch {
    token = null;
  }

  if (!token || typeof window === 'undefined') {
    return next(req);
  }

  const requisicaoClonada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(requisicaoClonada);
};