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

        /// <summary>
        /// Retorna a lista de todos os animais cadastrados, incluindo os dados dos seus respectivos tutores.
        /// </summary>
        /// <response code="200">Lista de animais retornada com sucesso.</response>
        /// <response code="401">Acesso negado. Token não fornecido ou inválido.</response>
        // GET: api/animais
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
        {
            // Inclui os dados básicos do tutor na resposta para facilitar o front-end
            return await _context.Animais.Include(a => a.Tutor).ToListAsync();
        }

        /// <summary>
        /// Busca um animal específico pelo seu ID.
        /// </summary>
        /// <param name="id">ID do animal desejado.</param>
        /// <response code="200">Retorna os detalhes do animal.</response>
        /// <response code="401">Acesso negado. Token não fornecido ou inválido.</response>
        /// <response code="404">Animal não encontrado no banco de dados.</response>
        // GET: api/animais/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetAnimal(int id)
        {
            var animal = await _context.Animais.Include(a => a.Tutor).FirstOrDefaultAsync(a => a.Id == id);

            if (animal == null)
                return NotFound(new { message = "Animal não encontrado." });

            return animal;
        }

        /// <summary>
        /// Cadastra um novo animal e o vincula a um tutor existente.
        /// </summary>
        /// <param name="dto">Objeto contendo os dados do animal e o ID do seu tutor.</param>
        /// <response code="201">Animal cadastrado com sucesso.</response>
        /// <response code="400">Dados inválidos ou o Tutor informado não existe.</response>
        /// <response code="401">Acesso negado. Token não fornecido ou inválido.</response>
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

        /// <summary>
        /// Atualiza os dados de um animal existente no sistema.
        /// </summary>
        /// <param name="id">ID do animal que será atualizado.</param>
        /// <param name="dto">Objeto contendo os novos dados do animal.</param>
        /// <response code="200">Dados do animal atualizados com sucesso.</response>
        /// <response code="400">Dados inválidos ou novo Tutor informado não existe.</response>
        /// <response code="401">Acesso negado. Token não fornecido ou inválido.</response>
        /// <response code="404">Animal não encontrado no banco de dados.</response>
        // PUT: api/animais/{id}
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

        /// <summary>
        /// Remove um animal do sistema pelo seu ID.
        /// </summary>
        /// <param name="id">ID do animal que será removido.</param>
        /// <response code="200">Animal removido com sucesso.</response>
        /// <response code="401">Acesso negado. Token não fornecido ou inválido.</response>
        /// <response code="404">Animal não encontrado no banco de dados.</response>
        // DELETE: api/animais/{id}
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