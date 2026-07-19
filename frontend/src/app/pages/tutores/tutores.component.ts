import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnimalService } from '../../services/animal.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tutores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule, MatSnackBarModule],
  templateUrl: './tutores.component.html',
  styleUrls: ['./tutores.component.css']
})
export class TutoresComponent implements OnInit {
  private animalService = inject(AnimalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  tutores = new MatTableDataSource<any>([]);
  tutorForm!: FormGroup;
  exibindoFormulario = false;
  editando = false;

  ngOnInit(): void {
    this.iniciarFormulario();
    if (isPlatformBrowser(this.platformId)) {
      this.carregarTutores();
    }
  }

  iniciarFormulario(): void {
    this.tutorForm = this.fb.group({
      id: [0],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: this.fb.group({
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        cep: ['', Validators.required]
      })
    });
  }

  carregarTutores(): void {
    this.animalService.listarTutores().subscribe({
      next: (dados) => this.tutores.data = dados, 
      error: (err) => console.error('Erro ao carregar tutores', err)
    });
  }

  buscarCepTutor(): void {
    const cep = this.tutorForm.get('endereco.cep')?.value;
    if (!cep) return;
    const cepLimpo = String(cep).replace(/\D/g, '');
    if (cepLimpo.length < 8) return;

    this.animalService.consultarCep(cepLimpo).subscribe({
      next: (dados: any) => {
        if (!dados.erro) {
          this.tutorForm.get('endereco')?.patchValue({
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            uf: dados.uf
          });
        } else {
          this.snackBar.open('CEP não encontrado!', 'Fechar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Erro ao consultar CEP', err);
      }
    });
  }

  novoTutor(): void {
    this.exibindoFormulario = true;
    this.editando = false;
    this.tutorForm.reset({ id: 0 });
  }

  editarTutor(tutor: any): void {
    this.editando = true;
    this.exibindoFormulario = true;
    this.tutorForm.patchValue({
      id: tutor.id,
      nome: tutor.nome,
      cpf: tutor.cpf,
      telefone: tutor.telefone,
      email: tutor.email,
      endereco: {
        logradouro: tutor.endereco?.logradouro || '',
        numero: tutor.endereco?.numero || '',
        bairro: tutor.endereco?.bairro || '',
        cidade: tutor.endereco?.cidade || '',
        uf: tutor.endereco?.uf || '',
        cep: tutor.endereco?.cep || ''
      }
    });
  }

  salvar(): void {
    if (this.tutorForm.invalid) {
      this.snackBar.open('Preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    const rawCpf = String(this.tutorForm.value.cpf || '');
    const cpfDigits = rawCpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      this.snackBar.open('CPF inválido. Informe 11 dígitos.', 'Fechar', { duration: 3000 });
      return;
    }
    const formattedCpf = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    const rawCep = String(this.tutorForm.value.endereco.cep || '');
    const cepDigits = rawCep.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      this.snackBar.open('CEP inválido. Informe 8 dígitos.', 'Fechar', { duration: 3000 });
      return;
    }
    const formattedCep = cepDigits.replace(/(\d{5})(\d{3})/, '$1-$2');

    const dto = {
      Nome: this.tutorForm.value.nome,
      Cpf: formattedCpf,
      Telefone: this.tutorForm.value.telefone,
      Email: this.tutorForm.value.email,
      Endereco: {
        Logradouro: this.tutorForm.value.endereco.logradouro,
        Numero: this.tutorForm.value.endereco.numero,
        Bairro: this.tutorForm.value.endereco.bairro,
        Cidade: this.tutorForm.value.endereco.cidade,
        UF: this.tutorForm.value.endereco.uf,
        CEP: formattedCep
      }
    };

    if (this.editando && this.tutorForm.value.id) {
      this.animalService.editarTutor(this.tutorForm.value.id, dto).subscribe({
        next: () => { 
          this.exibindoFormulario = false; 
          this.carregarTutores(); 
          this.snackBar.open('Tutor atualizado.', 'Fechar', { duration: 3000 }); 
        },
        error: (err) => { 
          console.error('Erro ao atualizar tutor', err); 
          this.snackBar.open('Erro ao atualizar tutor.', 'Fechar', { duration: 4000 }); 
        }
      });
    } else {
      this.animalService.criarTutor(dto).subscribe({
        next: (res: any) => { 
           this.exibindoFormulario = false;
           this.carregarTutores();
           this.snackBar.open('Tutor criado. Voltando para Pets.', 'Fechar', { duration: 2000 });
          
          const newId = res?.id ?? res?.Id ?? null;
          if (newId) {
            this.router.navigate(['/animais'], { state: { newTutorId: newId } });
          } else {
            this.router.navigate(['/animais']);
          }
        },
        error: (err) => { 
          console.error('Erro ao criar tutor', err); 
          this.snackBar.open('Erro ao criar tutor.', 'Fechar', { duration: 4000 }); 
        }
      });
    }
  }

  removerTutor(id: number): void {
    if (!confirm('Tem certeza que deseja remover este tutor?')) return;
    this.animalService.excluirTutor(id).subscribe({
      next: () => { 
        this.carregarTutores(); 
        this.snackBar.open('Tutor removido.', 'Fechar', { duration: 3000 }); 
      },
      error: (err) => { 
        console.error('Erro ao remover tutor', err); 
        this.snackBar.open('Erro ao remover tutor.', 'Fechar', { duration: 4000 }); 
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}