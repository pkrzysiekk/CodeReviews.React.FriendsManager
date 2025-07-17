using FriendsAPI.Models;

namespace FriendsAPI.Service;

public interface IService<T>
{
   public Task<IEnumerable<T>> GetPagedEntities(int pageNumber, int pageSize);
   public Task<T?> GetEntityById(int id);
   public Task AddEntity(T entity);
   public Task UpdateEntity(T entity);
   public Task DeleteEntity(int id);
}