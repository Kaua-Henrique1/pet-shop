import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- 1. Importação adicionada aqui
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. RouterModule adicionado na lista de imports do componente
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  erroLogin: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // A estrutura deve bater exatamente com o que o Swagger pede: login e senha
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.erroLogin = ''; // Limpa erros anteriores

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Se deu 200 OK, redireciona o usuário para a tela de animais
        this.router.navigate(['/animais']); 
      },
      error: (err) => {
        console.error('Falha no login', err);
        // Exibe a mensagem de erro que você configurou no HTML
        this.erroLogin = 'Usuário ou senha inválidos. Tente novamente.'; 
      }
    });
  }
}