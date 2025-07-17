using System.Text.Json.Serialization;

namespace FriendsAPI.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    [JsonIgnore] 
    public ICollection<Friend> Friends { get; set; } = [];
}