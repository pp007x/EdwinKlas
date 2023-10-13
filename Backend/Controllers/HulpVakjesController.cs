using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace LoginApi.Controllers
{
[Route("api/[controller]")]
[ApiController]
public class HulpVakjesController : ControllerBase
{
    private readonly UserContext _context;

    public HulpVakjesController(UserContext context)
    {
        _context = context;
    }

    // Admin GET api/HulpVakjes/{companyId}
    [HttpGet("{companyId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<HulpVakjes>>> GetHulpVakjesForAdmin(int companyId)
    {
        return await _context.HulpVakjes.Where(h => h.CompanyId == companyId).ToListAsync();
    }

  // PUT: api/HulpVakjes/{id}
  [HttpPut("{id}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateHulpVakje(int id, HulpVakjes hulpVakje)
  {
      if (id != hulpVakje.Id)
      {
          return BadRequest();
      }

      _context.Entry(hulpVakje).State = EntityState.Modified;

      try
      {
          await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
          if (!HulpVakjeExists(id))
          {
              return NotFound();
          }
          else
          {
              throw;
          }
      }

      return NoContent();
  }

  private bool HulpVakjeExists(int id)
  {
      return _context.HulpVakjes.Any(e => e.Id == id);
  }


    // Admin POST api/HulpVakjes/
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HulpVakjes>> SetHulpVakje([FromBody] HulpVakjes hulpVakje)
    {
        _context.HulpVakjes.Add(hulpVakje);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetHulpVakjesForAdmin), new { companyId = hulpVakje.CompanyId }, hulpVakje);
    }

    // User GET api/HulpVakjes/{companyId}
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<HulpVakjes>>> GetHulpVakjesForUser()
    
    {
        var usernameClaim = User.Identity.Name;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameClaim);

        return await _context.HulpVakjes.Where(h => h.CompanyId == user.CompanyId).ToListAsync();

    }
}
}