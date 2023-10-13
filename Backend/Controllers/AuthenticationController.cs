using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserContext _context;
    private readonly ILogger<AuthenticationController> _logger;
    private readonly IConfiguration _configuration;

    public AuthenticationController(UserContext context, ILogger<AuthenticationController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }


[HttpPost("Register")]
public async Task<ActionResult<string>> Register(User newUser)
{
    _logger.LogInformation("Register endpoint hit");
    _logger.LogInformation($"Attempt to register with Username: {newUser.Username}");

    // Check if the user with the provided username already exists in the same company
    var existingUser = await _context.Users
        .SingleOrDefaultAsync(x => x.Username == newUser.Username);

    if (existingUser != null)
    {
        _logger.LogInformation("Username already exists in the same company");
        return BadRequest("Username already exists in the same company");
    }

    // Hash the password before storing it in the database
    newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

    // Add the new user to the database
    _context.Users.Add(newUser);
    await _context.SaveChangesAsync();

    // Generate a JWT token for the new user
    var token = GenerateJwtToken(newUser);

    _logger.LogInformation("User successfully registered");

    return Ok(token);
}


[HttpPost("Login")]
public async Task<ActionResult<string>> Login(User user)
{
    _logger.LogInformation("Login endpoint hit");
    _logger.LogInformation($"Attempt to login with Username: {user.Username}");

    var foundUser = await _context.Users
        .SingleOrDefaultAsync(x => x.Username == user.Username);

    if (foundUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, foundUser.Password))
    {
        _logger.LogInformation("User not found or incorrect password");
        return NotFound();
    }

    var token = GenerateJwtToken(foundUser);

    _logger.LogInformation("User found and authenticated");

    return Ok(token);
}


private string GenerateJwtToken(User user)
{
var claims = new List<Claim>
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // assuming user.Id is the unique identifier for the user
    new Claim(ClaimTypes.Name, user.Username),
};

if (user.IsAdmin)
    claims.Add(new Claim(ClaimTypes.Role, "Admin"));
if (user.IsMod)
    claims.Add(new Claim(ClaimTypes.Role, "Mod"));
if (!user.IsAdmin && !user.IsMod)
    claims.Add(new Claim(ClaimTypes.Role, "User"));



    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],  // changed this line to Jwt:Audience from Jwt:Issuer
        claims: claims,
        expires: DateTime.Now.AddMinutes(120),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}


}
