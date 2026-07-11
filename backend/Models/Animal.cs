using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetShopManager.Models
{
    public class Animal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(80)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int Idade { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Peso { get; set; }

        [Required]
        public DateTime DataNascimento { get; set; }

        public string? Foto { get; set; } 

        [Required]
        public EspecieEnum Especie { get; set; } 

        [Required]
        public int TutorId { get; set; }
        
        [ForeignKey("TutorId")]
        public Tutor? Tutor { get; set; }
    }
}