namespace FriendsAPI.Models.DTO;

public class FriendDTO
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Name { get; set; }
    public DateTime LastContactDate { get; set; }
    public string LastContactType {get; set;}
    public string DesiredContactFrequency {get; set;}

    public static Friend ToBO(FriendDTO friendDTO)
    {
        return new Friend()
        {
            Id = friendDTO.Id,
            CategoryId = friendDTO.CategoryId,
            DesiredContactFrequency = friendDTO.DesiredContactFrequency,
            LastContactDate = friendDTO.LastContactDate,
            LastContactType = friendDTO.LastContactType,
            Name = friendDTO.Name,
        };
    }

    public static FriendDTO ToDTO(Friend friend)
    {
        return new FriendDTO()
        {
            Id = friend.Id,
            CategoryId = friend.CategoryId,
            DesiredContactFrequency = friend.DesiredContactFrequency,
            LastContactDate = friend.LastContactDate,
            LastContactType = friend.LastContactType,
            Name = friend.Name,
            CategoryName =  friend.Category != null ? friend.Category.Name : "Unknown"
        };

    }
}