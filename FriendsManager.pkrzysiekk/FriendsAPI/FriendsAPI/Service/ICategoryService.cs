using FriendsAPI.Models;

namespace FriendsAPI.Service;

public interface ICategoryService
{
   public IQueryable<Category> GetAllCategories();
   public Task<Category?> GetCategoryById(int id);
   public Task AddCategory(Category category);
   public Task UpdateCategory(Category category);
   public Task DeleteCategory(int id);
}