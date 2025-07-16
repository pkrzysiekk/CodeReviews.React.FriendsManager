namespace FriendsAPI.Models;

public class Friend
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime LastContactDate { get; set; }
    public string LastContactType {get; set;}
    public string DesiredContactFrequency {get; set;}
}