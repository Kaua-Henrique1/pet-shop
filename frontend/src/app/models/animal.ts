export interface Animal {
  id?: number;
  nome: string;
  idade: number;
  peso: number;
  dataNascimento: string; // ou Date
  foto?: string;
  especie: string;
  nomeTutor: string;
  // Dados de Endereço do Tutor
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}