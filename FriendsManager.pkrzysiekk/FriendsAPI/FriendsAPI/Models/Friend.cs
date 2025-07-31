using System.Text.Json.Serialization;

namespace FriendsAPI.Models;

public class Friend
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; }
    public DateTime LastContactDate { get; set; }
    public string LastContactType {get; set;}
    public int DesiredContactFrequency {get; set;}
    
    [JsonIgnore]
    public Category? Category {get; set;}
}