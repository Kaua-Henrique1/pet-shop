import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AnimaisComponent } from './pages/animais/animais.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'animais', component: AnimaisComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redireciona a raiz para o login
];