using Microsoft.EntityFrameworkCore;
using webproj1.Models;

namespace webproj1.Infrastructure
{
    public class DbContextt : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbContextt(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DbContextt).Assembly);
        }

        // Pronalazak korisnika po ID
        public User GetUserById(int id)
        {
            return Users.Find(id);
        }

        // Ako želiš i po username
        public User GetUserByName(string name)
        {
            return Users.FirstOrDefault(u => u.Name == name);
        }
    }
}
