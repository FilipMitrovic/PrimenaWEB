using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using webproj1.Models;

public class ResultConfiguration : IEntityTypeConfiguration<Result>
{
    public void Configure(EntityTypeBuilder<Result> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.ScorePercent).IsRequired();
        builder.Property(r => r.CorrectAnswers).IsRequired();
        builder.Property(r => r.TotalQuestions).IsRequired();
        builder.Property(r => r.DurationSeconds).IsRequired();

        builder.HasOne(r => r.User)
               .WithMany() // kasnije možemo dodati ICollection<Result> u User
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Quiz)
               .WithMany() // kasnije možemo dodati ICollection<Result> u Quiz
               .HasForeignKey(r => r.QuizId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
