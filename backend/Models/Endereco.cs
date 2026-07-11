using System.ComponentModel.DataAnnotations;

namespace PetShopManager.Models
{
    public class Endereco
    {
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
    }
}