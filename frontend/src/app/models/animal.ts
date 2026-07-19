export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
}

export interface Animal {
  id: number;
  nome: string;
  idade: number;
  peso: number;
  dataNascimento: string;
  foto?: string;
  especie: number; // O Swagger retorna um número (0 ou 1)
  tutorId: number;
  tutor?: Tutor; // O objeto tutor aninhado
}