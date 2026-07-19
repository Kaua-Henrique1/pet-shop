import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal'; // Ajuste o caminho conforme sua estrutura

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5036/api/animais'; // Confirme a rota exata com seu amigo

  listarAnimais(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl);
  }
}