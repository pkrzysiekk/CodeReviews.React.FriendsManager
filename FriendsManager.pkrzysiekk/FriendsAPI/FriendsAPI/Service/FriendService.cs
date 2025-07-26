using FriendsAPI.Models;
using FriendsAPI.Models.DTO;
using FriendsAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FriendsAPI.Service;

public class FriendService :IService<FriendDTO>
{
    private readonly IRepository<Friend> _repository;
    private readonly IRepository<Category> _categoryRepository;

    public FriendService(IRepository<Friend> repository, IRepository<Category> categoryRepository)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<FriendDTO>> GetPagedEntities(int pageNumber, int pageSize)
    {
        var pagedResult = await _repository
            .GetAll()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        var pagedDTO = pagedResult.Select(x => FriendDTO.ToDTO(x));
        return pagedDTO;
    }

    public async Task<FriendDTO?> GetEntityById(int id)
    {
        var entity = await _repository.GetById(id);
        return entity == null ? null : FriendDTO.ToDTO(entity);
    }

    public async Task AddEntity(FriendDTO entity)
    {
        var category = await _categoryRepository.GetById(entity.CategoryId);
        if (category == null)
            throw new Exception("Category not found");
        var dto = FriendDTO.ToBO(entity);
        dto.Category = category;
        await _repository.Create(dto);
        
    }

    public async Task UpdateEntity(FriendDTO entity)
    {
        var bo = FriendDTO.ToBO(entity);
        await _repository.Update(bo);
    }

    public async Task DeleteEntity(int id)
    {
        await _repository.Delete(id);
    }
}