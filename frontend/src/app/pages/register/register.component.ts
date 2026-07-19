import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      senhaConfirm: ['', [Validators.required]]
    }, { validators: this.senhasCoincidem });
  }

  senhasCoincidem(group: FormGroup) {
    const s = group.get('senha')?.value;
    const c = group.get('senhaConfirm')?.value;
    return s === c ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const payload = {
      login: this.registerForm.value.login,
      senha: this.registerForm.value.senha
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.snackBar.open('Usuário registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao registrar usuário', err);
        const msg = err?.error?.message || 'Erro ao registrar usuário.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
