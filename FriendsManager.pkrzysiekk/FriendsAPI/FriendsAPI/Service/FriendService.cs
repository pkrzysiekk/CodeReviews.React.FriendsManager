using FriendsAPI.Models;
using FriendsAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Service;

public class FriendService :IService<Friend>
{
    private readonly IRepository<Friend> _repository;

    public FriendService(IRepository<Friend> repository)
    {
        _repository = repository;
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