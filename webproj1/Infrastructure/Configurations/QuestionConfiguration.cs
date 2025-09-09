using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using webproj1.Models;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);
        builder.Property(q => q.Text).IsRequired();

        builder.HasOne(q => q.Quiz)
               .WithMany(qz => qz.Questions)
               .HasForeignKey(q => q.QuizId);
    }
}

