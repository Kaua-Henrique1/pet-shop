using System.ComponentModel.DataAnnotations;

namespace PetShopManager.DTOs
{
    public class EnderecoDto
    {
        [Required(ErrorMessage = "O logradouro é obrigatório.")]
        [StringLength(150)]
        public string Logradouro { get; set; } = string.Empty;

        [Required(ErrorMessage = "O número é obrigatório.")]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;

        [Required(ErrorMessage = "O bairro é obrigatório.")]
        [StringLength(50)]
        public string Bairro { get; set; } = string.Empty;

        [Required(ErrorMessage = "A cidade é obrigatória.")]
        [StringLength(50)]
        public string Cidade { get; set; } = string.Empty;

        [Required(ErrorMessage = "A UF é obrigatória.")]
        [StringLength(2, MinimumLength = 2, ErrorMessage = "A UF must have exactly 2 characters.")]
        public string UF { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CEP é obrigatório.")]
        [StringLength(9)]
        public string CEP { get; set; } = string.Empty;
    }

    public class CreateTutorDto
    {
        [Required(ErrorMessage = "O nome do tutor é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        /// <summary>
        /// CPF do tutor. Deve ser único e seguir o formato padrão com pontos e hífen.
        /// </summary>
        /// <example>123.456.789-00</example>
        [Required(ErrorMessage = "O CPF é obrigatório.")]
        [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "O CPF deve seguir o formato 000.000.000-00")]
        public string Cpf { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [StringLength(20)]
        public string Telefone { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Os dados do endereço são obrigatórios.")]
        public EnderecoDto Endereco { get; set; } = null!;
    }
}