using FriendsAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Data;

public class FriendsContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Friend> Friends { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=friends.db");
    }
}