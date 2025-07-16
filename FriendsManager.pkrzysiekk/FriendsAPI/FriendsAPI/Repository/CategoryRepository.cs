using FriendsAPI.Data;
using FriendsAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Repository;

public class CategoryRepository : IRepository<Category>
{
    public readonly FriendsContext _context;

    public CategoryRepository(FriendsContext context)
    {
        _context = context;
    }
    
    public IQueryable<Category> GetAll()
    {
        return _context.Categories
            .Include(c=>c.Friends)
            .AsQueryable();
    }

    public async Task<Category?> GetById(int id)
    {
       return await _context.Categories.FindAsync(id);
    }

    public async Task Create(Category entity)
    {
        await _context.Categories.AddAsync(entity);
        await SaveChanges();
    }

    public async Task Update(Category entity)
    {
        var category= await GetById(entity.Id);
        if (category == null)
            return;
        category.Name = entity.Name;
        await SaveChanges();
    }

    public async Task Delete(int id)
    {
        var category = await GetById(id);
        if (category == null)
            return;
        _context.Categories.Remove(category);
        await SaveChanges();
    }

    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }
}