using System.ComponentModel.DataAnnotations;

namespace PetShopManager.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "O login é obrigatório.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "O login deve ter entre 3 e 50 caracteres.")]
        public string Login { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 20 caracteres.")]
        public string Senha { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required(ErrorMessage = "O login é obrigatório.")]
        public string Login { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Senha { get; set; } = string.Empty;
    }
}