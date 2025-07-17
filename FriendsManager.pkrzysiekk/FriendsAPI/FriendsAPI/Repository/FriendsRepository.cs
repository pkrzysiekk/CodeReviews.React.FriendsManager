using FriendsAPI.Data;
using FriendsAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Repository;

public class FriendsRepository : IRepository<Friend>
{
    private readonly FriendsContext _context;

    public FriendsRepository(FriendsContext context)
    {
        _context = context;
    }

    public IQueryable<Friend> GetAll()
    {
        return _context
            .Friends
            .Include(c => c.Category)
            .AsQueryable();
    }

    public async Task<Friend?> GetById(int id)
    {
        var friend = await _context
            .Friends
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.Id == id);
        return friend;
    }

    public async Task Create(Friend entity)
    {
        await _context.Friends.AddAsync(entity);
        await SaveChanges();
    }

    public async Task Update(Friend entity)
    {
        var friend = await GetById(entity.Id);
        if (friend == null)
            return;
        if (!await isCategoryExist(friend.Category.Id))
            return;
        friend.Name = entity.Name;
        friend.CategoryId = entity.CategoryId;
        friend.DesiredContactFrequency = entity.DesiredContactFrequency;
        friend.LastContactDate = entity.LastContactDate;
        friend.LastContactType = entity.LastContactType;

        await SaveChanges();
    }

    public async Task Delete(int id)
    {
        var friend = await GetById(id);
        if (friend != null)
        {
            _context.Friends.Remove(friend);
            await SaveChanges();
        }
    }

    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }

    private async Task<bool> isCategoryExist(int categoryId)
    {
        return await _context.Categories.AnyAsync(c => c.Id == categoryId);
    }
}