using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using webproj1.Models;

public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
{
    public void Configure(EntityTypeBuilder<Quiz> builder)
    {
        builder.HasKey(q => q.Id);
        builder.Property(q => q.Title).IsRequired().HasMaxLength(100);
        builder.Property(q => q.Category).IsRequired().HasMaxLength(50);
        builder.Property(q => q.Difficulty).IsRequired().HasMaxLength(20);
    }
}