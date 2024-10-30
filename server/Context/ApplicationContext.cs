using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Context
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configuration is handled in Program.cs
        }

        public DbSet<server.Models.Task>? Tasks { get; set; }

        public DbSet<server.Models.Subtask>? Subtasks { get; set; }

        public DbSet<server.Models.RecurringTask>? RecurringTasks { get; set; }

        public DbSet<server.Models.List>? Lists { get; set; }

        public DbSet<server.Models.Label>? Labels { get; set; }

        public DbSet<server.Models.Project>? Projects { get; set; }
    }
}
