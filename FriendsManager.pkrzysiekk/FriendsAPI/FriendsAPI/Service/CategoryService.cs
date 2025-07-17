using FriendsAPI.Models;
using FriendsAPI.Repository;

namespace FriendsAPI.Service;

public class CategoryService : ICategoryService
{
    private readonly IRepository<Category> _repository;

    public CategoryService(IRepository<Category> repository)
    {
       _repository = repository; 
    }
    
    public IQueryable<Category> GetAllCategories()
    {
        return _repository.GetAll();     
    }

    public async Task<Category?> GetCategoryById(int id)
    {
        return await _repository.GetById(id);
    }

    public async Task AddCategory(Category category)
    {
        await _repository.Create(category);
    }

    public async Task UpdateCategory(Category category)
    {
        await _repository.Update(category);
    }

    public async Task DeleteCategory(int id)
    {
        await _repository.Delete(id);
    }
}