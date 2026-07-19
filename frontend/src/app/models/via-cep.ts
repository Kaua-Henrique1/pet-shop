export interface ViaCep {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string; // O ViaCEP retorna a cidade com o nome de "localidade"
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean; // Propriedade importante caso o usuário digite um CEP que não existe
}