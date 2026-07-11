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
        [StringLength(9)]
        public string CEP { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string Logradouro { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Bairro { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Cidade { get; set; } = string.Empty;

        [Required]
        [StringLength(2)]
        public string UF { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Animal> Animais { get; set; } = new List<Animal>();
    }
}