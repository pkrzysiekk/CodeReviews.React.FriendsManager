namespace FriendsAPI.Repository;

public interface IRepository<T> where T : class
{
    public IQueryable<T> GetAll();
    public Task<T?> GetById(int id);
    public Task Create(T entity);
    public Task Update(T entity);
    public Task Delete(int id);
    public Task SaveChanges();
}