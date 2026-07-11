using Microsoft.EntityFrameworkCore;
using PetShopManager.Models;

namespace PetShopManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Tutor> Tutores { get; set; }
        public DbSet<Animal> Animais { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapeia o Endereço como Owned Type na tabela de Tutor
            modelBuilder.Entity<Tutor>().OwnsOne(t => t.Endereco, e =>
            {
                e.Property(p => p.CEP).HasColumnName("CEP").HasMaxLength(9);
                e.Property(p => p.Logradouro).HasColumnName("Logradouro").HasMaxLength(150);
                e.Property(p => p.Numero).HasColumnName("Numero").HasMaxLength(10);
                e.Property(p => p.Bairro).HasColumnName("Bairro").HasMaxLength(50);
                e.Property(p => p.Cidade).HasColumnName("Cidade").HasMaxLength(50);
                e.Property(p => p.UF).HasColumnName("UF").HasMaxLength(2);
            });

            // Configura o Relacionamento 1:N (Tutor -> Animais)
            modelBuilder.Entity<Animal>()
                .HasOne(a => a.Tutor)
                .WithMany(t => t.Animais)
                .HasForeignKey(a => a.TutorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}