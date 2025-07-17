using FriendsAPI.Models;
using FriendsAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Service;

public class FriendService :IService<Friend>
{
    private readonly IRepository<Friend> _repository;
    private readonly IRepository<Category> _categoryRepository;

    public FriendService(IRepository<Friend> repository, IRepository<Category> categoryRepository)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Friend>> GetPagedEntities(int pageNumber, int pageSize)
    {
        var pagedResult = await _repository
            .GetAll()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return pagedResult;
    }

    public async Task<Friend?> GetEntityById(int id)
    {
        var entity = await _repository.GetById(id);
        return entity;
    }

    public async Task AddEntity(Friend entity)
    {
        var category = await _categoryRepository.GetById(entity.CategoryId);
        if (category == null)
            throw new Exception("Category not found");
        entity.Category = category;
        await _repository.Create(entity);
        
    }

    public async Task UpdateEntity(Friend entity)
    {
        await _repository.Update(entity);
    }

    public async Task DeleteEntity(int id)
    {
        await _repository.Delete(id);
    }
}