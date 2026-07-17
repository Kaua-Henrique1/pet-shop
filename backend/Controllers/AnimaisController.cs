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
    [Authorize] // 🔐 Bloqueia acessos anônimos
    public class AnimaisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnimaisController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/animais
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
        {
            // Inclui os dados básicos do tutor na resposta para facilitar o front-end
            return await _context.Animais.Include(a => a.Tutor).ToListAsync();
        }

        // GET: api/animais/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetAnimal(int id)
        {
            var animal = await _context.Animais.Include(a => a.Tutor).FirstOrDefaultAsync(a => a.Id == id);

            if (animal == null)
                return NotFound(new { message = "Animal não encontrado." });

            return animal;
        }

        // POST: api/animais
        [HttpPost]
        public async Task<ActionResult<Animal>> PostAnimal([FromBody] CreateAnimalDto dto)
        {
            // Regra de Integridade: Verifica se o tutor informado realmente existe no MySQL
            var tutorExiste = await _context.Tutores.AnyAsync(t => t.Id == dto.TutorId);
            if (!tutorExiste)
            {
                return BadRequest(new { message = "Não é possível cadastrar o animal. O Tutor informado não existe." });
            }

            var animal = new Animal
            {
                Nome = dto.Nome,
                Idade = dto.Idade,
                Peso = dto.Peso,
                DataNascimento = dto.DataNascimento,
                Foto = dto.Foto,
                Especie = dto.Especie,
                TutorId = dto.TutorId
            };

            _context.Animais.Add(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id }, animal);
        }

        // PUT: api/animais/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnimal(int id, [FromBody] CreateAnimalDto dto)
        {
            var animal = await _context.Animais.FindAsync(id);

            if (animal == null)
                return NotFound(new { message = "Animal não encontrado." });

            // Valida se o novo tutor existe caso o TutorId esteja mudando
            var tutorExiste = await _context.Tutores.AnyAsync(t => t.Id == dto.TutorId);
            if (!tutorExiste)
            {
                return BadRequest(new { message = "Tutor informado inválido ou inexistente." });
            }

            animal.Nome = dto.Nome;
            animal.Idade = dto.Idade;
            animal.Peso = dto.Peso;
            animal.DataNascimento = dto.DataNascimento;
            animal.Foto = dto.Foto;
            animal.Especie = dto.Especie;
            animal.TutorId = dto.TutorId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Animais.AnyAsync(a => a.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return Ok(new { message = "Dados do animal atualizados com sucesso!", animal });
        }

        // DELETE: api/animais/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animais.FindAsync(id);
            if (animal == null)
                return NotFound(new { message = "Animal não encontrado." });

            _context.Animais.Remove(animal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Animal removido do sistema com sucesso!" });
        }
    }
}