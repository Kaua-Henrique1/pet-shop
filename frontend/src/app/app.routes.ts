import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AnimaisComponent } from './pages/animais/animais.component';
import { TutoresComponent } from './pages/tutores/tutores.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'animais', component: AnimaisComponent },
  { path: 'tutores', component: TutoresComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redireciona a raiz para o login
];