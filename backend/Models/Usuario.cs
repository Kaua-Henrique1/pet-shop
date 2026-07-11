using System.ComponentModel.DataAnnotations;

namespace PetShopManager.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string SenhaHash { get; set; } = string.Empty; // Guardar senha criptografada por segurança
    }
}