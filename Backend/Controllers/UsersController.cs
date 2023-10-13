using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LoginApi.Data;
using LoginApi.Models;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserContext _context;
    private readonly ILogger<UsersController> _logger;
    private readonly IConfiguration _configuration;

    public UsersController(UserContext context, ILogger<UsersController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet]
    [Authorize(Roles = "Admin, Mod")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

[HttpPost]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult<User>> PostUser(User user)
{
    if (user.CompanyId != null)
    {
        var company = await _context.Companies.FindAsync(user.CompanyId);
        if (company == null)
        {
            return NotFound(new { message = "Company not found" });
        }

        // Check if the user with the provided username already exists within the same company
        var existingUser = await _context.Users
            .SingleOrDefaultAsync(x => x.Username == user.Username);
        if (existingUser != null)
        {
            return BadRequest("Username already exists in the same company");
        }
    }

    // Hash the password before storing it in the database
    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetUsers", new { id = user.Id }, user);
}


    [HttpGet("Username")]
    [Authorize]
    public ActionResult<String> GetUsername()
    {
        var usernameClaim = User.Identity.Name;

        if (usernameClaim == null)
        {
            return NotFound();
        }

        return usernameClaim;
    }

    [HttpGet("Profile")]
    [Authorize]
    public ActionResult<User> GetProfile()
    {
        var usernameClaim = User.Identity.Name;
        var user = _context.Users.FirstOrDefault(u => u.Username == usernameClaim);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    // UserController.cs
[HttpDelete("{id}")]
[Authorize(Roles = "Admin, Mod")]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null)
    {
        return NotFound();
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent();
}
[HttpPost("GenerateResetToken/{id}")]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult> GenerateResetToken(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null)
    {
        return NotFound();
    }

    var rng = new Random();
    var token = rng.Next(100000, 999999); // 6-digit token

    var resetEntry = new PasswordReset
    {
        UserId = id,
        ResetToken = token
    };

    _context.PasswordResets.Add(resetEntry);
    await _context.SaveChangesAsync();

    return Ok(new { Token = token });
}
[HttpPost("ResetPassword")]
public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordModel model)
{
    var resetEntry = await _context.PasswordResets.FirstOrDefaultAsync(x => x.ResetToken == model.ResetToken);
    if (resetEntry == null)
    {
        return BadRequest(new { message = "Invalid token" });
    }

    var user = await _context.Users.FindAsync(resetEntry.UserId);
    if (user == null)
    {
        return NotFound();
    }

    // Update the user password here
    user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);

    _context.Entry(user).State = EntityState.Modified;
    _context.PasswordResets.Remove(resetEntry); // remove the reset entry
    await _context.SaveChangesAsync();

    return Ok();
}



public class ResetPasswordModel
{
    public int UserId { get; set; }
    public int ResetToken { get; set; }
    public string NewPassword { get; set; }
}

}
