namespace FriendsAPI.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int FriendId {get; set;} 
    
    public ICollection<Friend> Friends { get; set; }
}