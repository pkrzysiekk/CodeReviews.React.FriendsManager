using FriendsAPI.Models;
using FriendsAPI.Service;
using Microsoft.AspNetCore.Mvc;

namespace FriendsAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class CategoryController : ControllerBase
{
    private readonly IService<Category> _service;

    public CategoryController(IService<Category> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetPagedEntities ( [FromQuery]int pageNumber, [FromQuery] int pageSize)
    {
        var pagedResult = await _service.GetPagedEntities(pageNumber, pageSize);
        return Ok(pagedResult);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        Category cat = new();
        try
        {
            cat = await _service.GetEntityById(id);
        }
        catch
        {
            return BadRequest();
        }
        if(cat == null)
            return NotFound();
        return Ok(cat);
    }

    [HttpPost]
    public async Task<ActionResult> PostEntity([FromBody] Category cat)
    {
        try
        {
            await _service.AddEntity(cat);
        }
        catch
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpPatch]
    public async Task<ActionResult> UpdateEntity([FromBody] Category cat)
    {
        try
        {
            await _service.UpdateEntity(cat);
        }
        catch
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEntity(int id)
    {
        try
        {
            await _service.DeleteEntity(id);
        }
        catch
        {
            return BadRequest();
        }
        return Ok();
    }
}