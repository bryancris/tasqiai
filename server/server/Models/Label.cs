using Task = server.Models.Task;

namespace server.Models
{
    public class Label
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Color { get; set; }
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public User User { get; set; } = null!;
    }
}