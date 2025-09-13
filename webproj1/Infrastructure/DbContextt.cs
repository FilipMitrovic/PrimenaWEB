using Microsoft.EntityFrameworkCore;
using webproj1.Infrastructure.Configurations;
using webproj1.Models;

namespace webproj1.Infrastructure
{
    public class DbContextt : DbContext
    {
        public DbContextt(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Result> Results { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new QuizConfiguration());
            modelBuilder.ApplyConfiguration(new QuestionConfiguration());
            modelBuilder.ApplyConfiguration(new OptionConfiguration());
            modelBuilder.ApplyConfiguration(new ResultConfiguration());


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
