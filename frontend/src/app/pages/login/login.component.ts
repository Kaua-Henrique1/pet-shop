import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    login: ['', Validators.required],
    senha: ['', Validators.required]
  });

  erroLogin: string = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Quando der certo, ele vai redirecionar para a listagem (que vamos criar)
          this.router.navigate(['/animais']); 
        },
        error: (err) => {
          console.error(err);
          this.erroLogin = 'Usuário ou senha incorretos.';
        }
      });
    }
  }
}