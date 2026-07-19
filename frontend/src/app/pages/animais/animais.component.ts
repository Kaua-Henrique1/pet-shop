import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule, MatSnackBarModule], 
  templateUrl: './animais.component.html',
  styleUrl: './animais.component.css'
})
export class AnimaisComponent implements OnInit {
  private animalService = inject(AnimalService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private router = inject(Router);

  animais = new MatTableDataSource<Animal>([]);
  tutores: any[] = [];
  
  colunasExibidas: string[] = ['nome', 'especie', 'idade', 'peso', 'nomeTutor', 'acoes']; 
  
  animalForm!: FormGroup;
  editando = false;
  exibirFormulario = false;

  ngOnInit(): void {
    this.iniciarFormulario();
    if (isPlatformBrowser(this.platformId)) {
      this.carregarAnimais();
      this.carregarTutores();
    }
  }

  carregarTutores(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.animalService && (this.animalService as any).listarTutores) {
      (this.animalService as any).listarTutores().subscribe({
        next: (dados: any[]) => {
          this.tutores = dados;
          const newTutorId = (history && (history.state as any)?.newTutorId) || null;
          if (newTutorId) {
            try { this.animalForm.patchValue({ tutorId: Number(newTutorId) }); } catch { }
          }
        },
        error: (err: any) => console.error('Erro ao carregar tutores', err)
      });
    }
  }

  iniciarFormulario(): void {
    this.animalForm = this.fb.group({
      id: [0],
      nome: ['', Validators.required],
      idade: [''], 
      peso: ['', Validators.required],
      dataNascimento: [''], 
      foto: [''],
      especie: ['', Validators.required],
      tutorId: [0, Validators.required]
    });
  }

  novoAnimal(): void {
    this.exibirFormulario = true;
    this.editando = false;
    this.animalForm.reset({ id: 0 });
  }

  carregarAnimais(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.animalService.listarAnimais().subscribe({
      next: (dados: Animal[]) => {
        this.animais.data = Array.isArray(dados) ? dados : [];
      },
      error: (erro) => {
        console.error('Erro ao buscar animais', erro);
        this.animais.data = [];
      }
    });
  }

  calcularIdade(): void {
    const dataNascimento = this.animalForm.get('dataNascimento')?.value;
    if (!dataNascimento) {
      return;
    }
    const nascimento = new Date(dataNascimento);
    if (isNaN(nascimento.getTime())) {
      return;
    }
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    if (!isNaN(idade)) {
      this.animalForm.patchValue({
        idade: idade
      });
    }
  }

  salvar() {
    if (this.animalForm.invalid) {
      console.warn('Formulário preenchido incorretamente.');
      return;
    }
    const formDados = this.animalForm.value;
    const idadeNum = Number(formDados.idade);
    const pesoNum = Number(formDados.peso);
    const dataNascimentoVal = formDados.dataNascimento ? new Date(formDados.dataNascimento) : new Date();

    if (!formDados.nome || String(formDados.nome).trim() === '') {
      this.snackBar.open('Nome é obrigatório.', 'Fechar', { duration: 3000 });
      return;
    }
    if (isNaN(pesoNum) || pesoNum < 0.01) {
      this.snackBar.open('Peso inválido. Informe um valor maior que 0.', 'Fechar', { duration: 3000 });
      return;
    }

    const tutorIdSelected = Number(formDados.tutorId || 0);
    if (!tutorIdSelected || tutorIdSelected <= 0) {
      this.snackBar.open('Selecione um tutor válido antes de cadastrar o animal.', 'Fechar', { duration: 3000 });
      return;
    }

    const especieValor = Number(formDados.especie);

    const payloadParaApi = {
      nome: formDados.nome,
      idade: isNaN(idadeNum) ? 0 : idadeNum,
      peso: pesoNum,
      dataNascimento: dataNascimentoVal.toISOString(),
      foto: formDados.foto || "",
      especie: especieValor,
      tutorId: tutorIdSelected
    };
    
    console.log('Enviando para o backend:', payloadParaApi);

    if (this.editando) {
      const editId = Number(formDados.id);
      
      if (!editId || isNaN(editId)) {
        this.snackBar.open('ID inválido para edição.', 'Fechar', { duration: 3000 });
        return;
      }

      this.animalService.editar(editId, payloadParaApi).subscribe({
        next: () => {
          this.snackBar.open('Animal atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.exibirFormulario = false;
          this.editando = false;
          this.animalForm.reset({ id: 0 });
          this.carregarAnimais();
        },
        error: (erro) => {
          console.error('Erro ao atualizar animal:', erro);
          const serverMsg = erro?.error?.message || 'Erro ao atualizar animal. Verifique os dados.';
          this.snackBar.open(serverMsg, 'Fechar', { duration: 4000 });
        }
      });
    } else {
      this.animalService.incluir(payloadParaApi).subscribe({
        next: (animalCriado) => {
          this.snackBar.open('Pet cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.exibirFormulario = false;
          this.animalForm.reset({ id: 0 });

          if (animalCriado) {
            const novoAnimal = {
              ...(animalCriado as any),
              tutor: (animalCriado as any).tutor ?? undefined
            };
            this.animais.data = [novoAnimal, ...this.animais.data.filter((item) => item.id !== novoAnimal.id)];
          }
          this.carregarAnimais();
        },
        error: (erro) => {
          console.error('O backend rejeitou o cadastro:', erro);
          const serverMsg = erro?.error?.message || 'Erro ao salvar. Verifique o console.';
          this.snackBar.open(serverMsg, 'Fechar', { duration: 4000 });
        }
      });
    }
  }

  prepararEdicao(animalDaTabela: Animal): void {
    this.animalService.buscarPorId(animalDaTabela.id).subscribe({
      next: (animalFresco: Animal) => {
        this.editando = true;
        
        const dataFormatada = animalFresco.dataNascimento 
          ? new Date(animalFresco.dataNascimento).toISOString().substring(0, 10) 
          : '';

        this.animalForm.patchValue({
          id: animalFresco.id,
          nome: animalFresco.nome,
          idade: animalFresco.idade,
          peso: animalFresco.peso,
          dataNascimento: dataFormatada,
          foto: animalFresco.foto || '',
          especie: animalFresco.especie,
          tutorId: animalFresco.tutorId
        });
        this.exibirFormulario = true;
      },
      error: (erro) => {
        console.error('Erro ao buscar o animal pelo ID:', erro);
        this.snackBar.open('Animal não encontrado ou erro no servidor.', 'Fechar', { duration: 3000 });
      }
    });
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.animalForm.reset({ id: 0 });
    this.exibirFormulario = false;
  }

  excluirAnimal(id: number): void {
    if (!confirm('Tem certeza que deseja remover este animal?')) {
      return;
    }
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      this.snackBar.open('ID inválido para exclusão.', 'Fechar', { duration: 3000 });
      return;
    }

    this.animalService.excluir(numericId).subscribe({
      next: () => {
        this.snackBar.open('Animal removido com sucesso!', 'Fechar', { duration: 3000 });
        this.animais.data = this.animais.data.filter((animal) => animal.id !== numericId);
        this.carregarAnimais();
      },
      error: (erro: any) => {
        console.error('Erro ao excluir', erro);
        
        if (erro.status === 404) {
          this.snackBar.open('Animal não encontrado no sistema.', 'Fechar', { duration: 4000 });
        } else if (erro.status === 401) {
          this.snackBar.open('Sessão expirada. Faça login novamente.', 'Fechar', { duration: 4000 });
        } else {
          this.snackBar.open('Erro ao remover animal.', 'Fechar', { duration: 4000 });
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}