using LoginApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LoginApi.Data
{
public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<TotalScore> TotalScores { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Onderwerp> Onderwerpen { get; set; }
    public DbSet<PasswordReset> PasswordResets { get; set; }

    public DbSet<QuestionOpen> QuestionOpen { get; set; }

    public DbSet<OpenAnswers> OpenAnswers { get; set; }
    public DbSet<Link> Links { get; set; }

    public DbSet<HulpVakjes> HulpVakjes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>()
            .HasIndex(c => c.Name)
            .IsUnique();
        modelBuilder.Entity<Link>()
            .HasIndex(c => c.CompanyId)
            .IsUnique();
    }
}
}