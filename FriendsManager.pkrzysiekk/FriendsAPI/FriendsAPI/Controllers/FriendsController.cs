using FriendsAPI.Models;
using FriendsAPI.Service;
using Microsoft.AspNetCore.Mvc;

namespace FriendsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class FriendsController : ControllerBase
{
    private readonly IService<Friend> _service;

    public FriendsController(IService<Friend> service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Friend>>> GetPagedResult(int pageNumber, int pageSize)
    {
        var pagedResult =  await _service.GetPagedEntities(pageNumber, pageSize);
        return Ok(pagedResult);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Friend>> GetEntity(int id)
    {
        var result = await _service.GetEntityById(id);
        if(result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult> CreateEntity([FromBody] Friend friend)
    {
        try
        {
            await _service.AddEntity(friend);
        }
        catch
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpPatch]
    public async Task<ActionResult<Friend>> UpdateEntity([FromBody] Friend friend)
    {
        try
        {
            await _service.UpdateEntity(friend);
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