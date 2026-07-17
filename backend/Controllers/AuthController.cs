using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PetShopManager.Data;
using PetShopManager.DTOs;
using PetShopManager.Models;

namespace PetShopManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Verifica se o login já existe no banco de dados
            if (await _context.Usuarios.AnyAsync(u => u.Login == dto.Login))
            {
                return BadRequest(new { message = "Este nome de usuário já está em uso." });
            }

            // Cria o Hash seguro da senha usando BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

            var usuario = new Usuario
            {
                Login = dto.Login,
                SenhaHash = passwordHash
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário registrado com sucesso!" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Busca o usuário pelo Login
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Login == dto.Login);

            // Valida a existência e a senha criptografada
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
            {
                return Unauthorized(new { message = "Usuário ou senha incorretos." });
            }

            // Gera o token JWT para o Angular
            var token = GerarTokenJwt(usuario);

            return Ok(new { 
                token, 
                usuario = new { usuario.Id, usuario.Login } 
            });
        }

        // Método auxiliar para criar o token com as claims corretas
        private string GerarTokenJwt(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Login) // Usando o Login como Name identificador
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}