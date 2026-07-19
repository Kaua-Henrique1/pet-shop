import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Animal } from '../models/animal';
import { ViaCep } from '../models/via-cep'; // <-- Lembre-se de importar o modelo do ViaCEP
import { API_BASE } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private http = inject(HttpClient);
  
  private apiUrl = `${API_BASE}/Animais`;

  private normalizarAnimal(item: any): Animal {
    const tutorRaw = item?.tutor ?? item?.Tutor;

    return {
      id: item?.id ?? item?.Id ?? 0,
      nome: item?.nome ?? item?.Nome ?? '',
      idade: item?.idade ?? item?.Idade ?? 0,
      peso: item?.peso ?? item?.Peso ?? 0,
      dataNascimento: item?.dataNascimento ?? item?.DataNascimento ?? '',
      foto: item?.foto ?? item?.Foto ?? '',
      especie: item?.especie ?? item?.Especie ?? 0,
      tutorId: item?.tutorId ?? item?.TutorId ?? 0,
      tutor: tutorRaw ? {
        id: tutorRaw?.id ?? tutorRaw?.Id ?? 0,
        nome: tutorRaw?.nome ?? tutorRaw?.Nome ?? '',
        email: tutorRaw?.email ?? tutorRaw?.Email ?? '',
        telefone: tutorRaw?.telefone ?? tutorRaw?.Telefone ?? '',
        cpf: tutorRaw?.cpf ?? tutorRaw?.Cpf ?? '',
        endereco: {
          cep: tutorRaw?.endereco?.cep ?? tutorRaw?.endereco?.Cep ?? tutorRaw?.Endereco?.cep ?? tutorRaw?.Endereco?.Cep ?? '',
          logradouro: tutorRaw?.endereco?.logradouro ?? tutorRaw?.endereco?.Logradouro ?? tutorRaw?.Endereco?.logradouro ?? tutorRaw?.Endereco?.Logradouro ?? '',
          numero: tutorRaw?.endereco?.numero ?? tutorRaw?.endereco?.Numero ?? tutorRaw?.Endereco?.numero ?? tutorRaw?.Endereco?.Numero ?? '',
          bairro: tutorRaw?.endereco?.bairro ?? tutorRaw?.endereco?.Bairro ?? tutorRaw?.Endereco?.bairro ?? tutorRaw?.Endereco?.Bairro ?? '',
          cidade: tutorRaw?.endereco?.cidade ?? tutorRaw?.endereco?.Cidade ?? tutorRaw?.Endereco?.cidade ?? tutorRaw?.Endereco?.Cidade ?? '',
          uf: tutorRaw?.endereco?.uf ?? tutorRaw?.endereco?.Uf ?? tutorRaw?.Endereco?.uf ?? tutorRaw?.Endereco?.Uf ?? ''
        }
      } : undefined
    };
  }

  // --- 1. CRUD COMPLETO ---
  
  listarAnimais(): Observable<Animal[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((dados) => dados.map((item) => this.normalizarAnimal(item)))
    );
  }

  // NOVO MÉTODO: Busca um pet específico pelo ID
  buscarPorId(id: number): Observable<Animal> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((item) => this.normalizarAnimal(item))
    );
  }

  incluir(animal: any): Observable<Animal> {
    console.debug('[AnimalService] POST payload:', animal);
    return this.http.post<any>(this.apiUrl, animal).pipe(
      map((res) => this.normalizarAnimal(res)),
      tap({
        next: (res) => console.debug('[AnimalService] POST response:', res),
        error: (err) => console.error('[AnimalService] POST error:', err)
      })
    );
  }

  editar(id: number, animal: any): Observable<any> {
    console.debug('[AnimalService] PUT payload:', { id, animal });
    return this.http.put<any>(`${this.apiUrl}/${id}`, animal).pipe(
      tap({
        next: (res) => console.debug('[AnimalService] PUT response:', res),
        error: (err) => console.error('[AnimalService] PUT error:', err)
      })
    );
  }

  excluir(id: number): Observable<any> {
    console.debug('[AnimalService] DELETE id:', id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: (res) => console.debug('[AnimalService] DELETE response:', res),
        error: (err) => console.error('[AnimalService] DELETE error:', err)
      })
    );
  }

  // --- 2. CONSUMO DA API VIACEP ---
  
  consultarCep(cep: string): Observable<ViaCep> {
    // A função replace(/\D/g, '') garante que apenas números sejam enviados para a API
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<ViaCep>(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  }

  // --- 3. TUTORES (API) ---
  listarTutores(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/Tutores`);
  }

  criarTutor(tutor: any): Observable<any> {
    return this.http.post<any>(`${API_BASE}/Tutores`, tutor);
  }

  editarTutor(id: number, tutor: any): Observable<any> {
    return this.http.put<any>(`${API_BASE}/Tutores/${id}`, tutor);
  }

  excluirTutor(id: number): Observable<any> {
    return this.http.delete(`${API_BASE}/Tutores/${id}`);
  }
}