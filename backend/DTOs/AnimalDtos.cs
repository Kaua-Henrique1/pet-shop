using System.ComponentModel.DataAnnotations;
using PetShopManager.Models;

namespace PetShopManager.DTOs
{
    public class CreateAnimalDto
    {
        [Required(ErrorMessage = "O nome do animal é obrigatório.")]
        [StringLength(80)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A idade é obrigatória.")]
        [Range(0, 100, ErrorMessage = "A idade deve ser um valor real.")]
        public int Idade { get; set; }

        [Required(ErrorMessage = "O peso é obrigatório.")]
        [Range(0.01, 500.00, ErrorMessage = "O peso deve ser maior que zero.")]
        public decimal Peso { get; set; }

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; }

        public string? Foto { get; set; } // Recebe a string Base64 vinda do Angular

        [Required(ErrorMessage = "A espécie é obrigatória.")]
        public EspecieEnum Especie { get; set; }

        [Required(ErrorMessage = "O ID do tutor é obrigatório.")]
        public int TutorId { get; set; }
    }
}