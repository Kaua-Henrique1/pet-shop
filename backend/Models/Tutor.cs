using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PetShopManager.Models
{
    public class Tutor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Telefone { get; set; } = string.Empty;
        [Required]
        [StringLength(14)]
        public string Cpf { get; set; } = string.Empty;

        [Required]
        public Endereco Endereco { get; set; } = new Endereco();
        
        [JsonIgnore]
        public ICollection<Animal> Animais { get; set; } = new List<Animal>();
    }
}