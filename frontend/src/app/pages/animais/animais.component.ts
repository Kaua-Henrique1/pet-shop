import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal';

@Component({
  selector: 'app-animais',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './animais.component.html',
  styleUrl: './animais.component.css'
})
export class AnimaisComponent implements OnInit {
  private animalService = inject(AnimalService);
  
  animais: Animal[] = [];
  colunasExibidas: string[] = ['id', 'nome', 'especie', 'raca', 'acoes']; // Ajuste conforme as chaves da interface Animal

  ngOnInit(): void {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.animalService.listarAnimais().subscribe({
      next: (dados) => {
        this.animais = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar animais', erro);
      }
    });
  }
}