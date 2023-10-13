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
    public class CompaniesController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly ILogger<CompaniesController> _logger;
        private readonly IConfiguration _configuration;

        public CompaniesController(UserContext context, ILogger<CompaniesController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

[HttpPost]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult<Company>> PostCompany(Company company)
{
    try
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateException ex)
    {
        if (ex.InnerException != null && ex.InnerException.Message.Contains("UNIQUE constraint failed"))
        {
            // This is a unique constraint error
            return Conflict("A company with this name already exists.");
        }
        else
        {
            throw;
        }
    }

    return CreatedAtAction("GetCompanies", new { id = company.Id }, company);
}

[HttpGet("current")]
[Authorize]
public async Task<ActionResult<Company>> GetCurrentCompany()
{
    var usernameClaim = User.Identity.Name;
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameClaim);

    if (user == null)
    {
        return NotFound();
    }

    var company = await _context.Companies.FindAsync(user.CompanyId);
    if (company == null)
    {
        return NotFound();
    }

    return company;
}
[HttpGet("users")]
[Authorize]
public async Task<ActionResult<IEnumerable<User>>> GetUsersForCompany()
{
    var usernameClaim = User.Identity.Name;
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameClaim);

    if (user == null)
    {
        return NotFound();
    }

    var companyId = user.CompanyId;
    var users = await _context.Users.Where(u => u.CompanyId == companyId).ToListAsync();

    if (users == null)
    {
        return NotFound();
    }

    return users;
}


        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
            {
                return NotFound();
            }

            return company;
        }

        [HttpGet("{companyId}/users")]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersForCompany(int companyId)
        {
            var users = await _context.Users.Where(u => u.CompanyId == companyId).ToListAsync();

            if (users == null || users.Count == 0)
            {
                return Ok(new List<User>());
            }

            return users;
        }

[HttpGet("code/{companyCode}")]
public async Task<ActionResult<Company>> GetCompanyByCode(string companyCode)
{
    var company = await _context.Companies.FirstOrDefaultAsync(c => c.Code == companyCode);

    if (company == null)
    {
        return NotFound();
    }

    return company;
}

        // CompaniesController.cs
[HttpDelete("{id}")]
[Authorize(Roles = "Admin, Mod")]
public async Task<IActionResult> DeleteCompany(int id)
{
    var company = await _context.Companies.FindAsync(id);
    if (company == null)
    {
        return NotFound();
    }

    // Remove all users associated with this company
    var users = await _context.Users.Where(u => u.CompanyId == id).ToListAsync();
    _context.Users.RemoveRange(users);

    // Remove the company itself
    _context.Companies.Remove(company);
    await _context.SaveChangesAsync();

    return NoContent();
}

    }

    
}
