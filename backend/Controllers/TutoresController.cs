using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShopManager.Data;
using PetShopManager.DTOs;
using PetShopManager.Models;

namespace PetShopManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔐 Protege os endpoints com JWT
    public class TutoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TutoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tutores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tutor>>> GetTutores()
        {
            return await _context.Tutores.ToListAsync();
        }

        // GET: api/tutores/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Tutor>> GetTutor(int id)
        {
            var tutor = await _context.Tutores.FindAsync(id);

            if (tutor == null)
                return NotFound(new { message = "Tutor não encontrado." });

            return tutor;
        }

        // POST: api/tutores
        [HttpPost]
        public async Task<ActionResult<Tutor>> PostTutor([FromBody] CreateTutorDto dto)
        {
            if (await _context.Tutores.AnyAsync(t => t.Cpf == dto.Cpf))
            {
                return BadRequest(new { message = "Já existe um tutor cadastrado com este CPF." });
            }

            var tutor = new Tutor
            {
                Nome = dto.Nome,
                Cpf = dto.Cpf,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Endereco = new Endereco
                {
                    Logradouro = dto.Endereco.Logradouro,
                    Numero = dto.Endereco.Numero,
                    Bairro = dto.Endereco.Bairro,
                    Cidade = dto.Endereco.Cidade,
                    UF = dto.Endereco.UF, 
                    CEP = dto.Endereco.CEP   
                }
            };

            _context.Tutores.Add(tutor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTutor), new { id = tutor.Id }, tutor);
        }

        // PUT: api/tutores/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTutor(int id, [FromBody] CreateTutorDto dto)
        {
            var tutor = await _context.Tutores.FindAsync(id);

            if (tutor == null)
                return NotFound(new { message = "Tutor não encontrado." });

            tutor.Nome = dto.Nome;
            tutor.Cpf = dto.Cpf;
            tutor.Telefone = dto.Telefone;
            tutor.Email = dto.Email;
            
            tutor.Endereco.Logradouro = dto.Endereco.Logradouro;
            tutor.Endereco.Numero = dto.Endereco.Numero;
            tutor.Endereco.Bairro = dto.Endereco.Bairro;
            tutor.Endereco.Cidade = dto.Endereco.Cidade;
            tutor.Endereco.UF = dto.Endereco.UF; // Ajustado para UF
            tutor.Endereco.CEP = dto.Endereco.CEP;   // Ajustado para CEP

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Tutores.AnyAsync(t => t.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return Ok(new { message = "Dados do tutor atualizados com sucesso!", tutor });
        }

        // DELETE: api/tutores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTutor(int id)
        {
            var tutor = await _context.Tutores.FindAsync(id);
            if (tutor == null)
                return NotFound(new { message = "Tutor não encontrado." });

            _context.Tutores.Remove(tutor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tutor removido com sucesso!" });
        }
    }
}