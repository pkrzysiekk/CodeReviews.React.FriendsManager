using FriendsAPI.Models;
using FriendsAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Service;

public class CategoryService : IService<Category>
{
    private readonly IRepository<Category> _repository;

    public CategoryService(IRepository<Category> repository)
    {
       _repository = repository; 
    }
    
    public  async Task<IEnumerable<Category>> GetPagedEntities(int pageNumber, int pageSize)
    {
        var pagedResult = await _repository
            .GetAll()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return pagedResult;
    }

    public async Task<Category?> GetEntityById(int id)
    {
        return await _repository.GetById(id);
    }

    public async Task AddEntity(Category category)
    {
        await _repository.Create(category);
    }

    public async Task UpdateEntity(Category category)
    {
        await _repository.Update(category);
    }

    public async Task DeleteEntity(int id)
    {
        await _repository.Delete(id);
    }
}