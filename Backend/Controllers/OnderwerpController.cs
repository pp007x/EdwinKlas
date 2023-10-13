using System.Linq;
using System.Collections.Generic;
using LoginApi.Models;
using Microsoft.AspNetCore.Mvc;
using LoginApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnderwerpController : ControllerBase
    {
        private readonly UserContext _context;

        public OnderwerpController(UserContext context)
        {
            _context = context;
        }
    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<Onderwerp>> GetOnderwerpen()
    {
        return _context.Onderwerpen.ToList();
    }


private readonly Dictionary<string, string> _boxToOnderwerpMapping = new Dictionary<string, string>
{
    {"C", "Analyticus"},
    {"Cd", "Strateeg"},
    {"Cs", "Perfectionist"},
    {"Ci", "raadgever"},
    {"Dc", "Pionier"},
    {"D", "Beslisser"},
    {"Ds", "Doorzetter"},
    {"Di", "Avonturier"},
    {"Sc", "Specialist"},
    {"Sd", "Doener"},
    {"S", "Dienstverlener"},
    {"Si", "Helper"},
    {"Ic", "Diplomaat"},
    {"Id", "Inspirator"},
    {"Is", "Bemiddelaar"},
    {"I", "Entertainer"}
};



[HttpGet("user/me")]
[Authorize]
public async Task<ActionResult<Onderwerp>> GetOnderwerpForCurrentUser()
{
    var usernameClaim = User.Identity.Name;
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameClaim);

    if (user == null)
    {
        return NotFound();
    }

    string box = user.Box;

    if (!_boxToOnderwerpMapping.TryGetValue(box, out string onderwerpName))
    {
        return NotFound();
    }

    var onderwerp = await _context.Onderwerpen.FirstOrDefaultAsync(o => o.Name == onderwerpName);
    if (onderwerp == null)
    {
        return NotFound();
    }

    return onderwerp;
}

[HttpGet("welkom")]
public async Task<ActionResult<Onderwerp>> GetWelkom()
{
    var onderwerp = await _context.Onderwerpen.FirstOrDefaultAsync(o => o.Name == "Welkom!");
    if (onderwerp == null)
    {
        return NotFound();
    }

    return onderwerp;
}

[HttpGet("user/{userId}")]
[Authorize(Roles = "Admin, Mod")]
public ActionResult<Onderwerp> GetOnderwerpForUser(int userId)
{
    // Fetch the user
    var user = _context.Users.FirstOrDefault(u => u.Id == userId);
    if (user == null)
    {
        Console.WriteLine("User not found");
        return NotFound();
    }

    // Get the user's box
    string box = user.Box;

    // Map the box to the Onderwerp name
    if (!_boxToOnderwerpMapping.TryGetValue(box, out string onderwerpName))
    {
        Console.WriteLine("Box not found");
        return NotFound();
    }

    // Find the Onderwerp with the name
    var onderwerp = _context.Onderwerpen.FirstOrDefault(o => o.Name == onderwerpName);
    if (onderwerp == null)
    {
        Console.WriteLine("Onderwerp not found");
        return NotFound();
    }

    return onderwerp;
}


    // OnderwerpController.cs
[HttpGet("{id}")]
[Authorize(Roles = "Admin, Mod")]
public ActionResult<Onderwerp> GetOnderwerp(int id)
{
    var onderwerp = _context.Onderwerpen.Find(id);
    if (onderwerp == null)
    {
        return NotFound();
    }
    return onderwerp;
}

[HttpPut("{id}")]
[Authorize(Roles = "Admin, Mod")]
public ActionResult<Onderwerp> UpdateOnderwerp(int id, Onderwerp onderwerp)
{
    if (id != onderwerp.Id)
    {
        return BadRequest();
    }

    _context.Entry(onderwerp).State = EntityState.Modified;
    try
    {
        _context.SaveChanges();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!_context.Onderwerpen.Any(o => o.Id == id))
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

    }
}
