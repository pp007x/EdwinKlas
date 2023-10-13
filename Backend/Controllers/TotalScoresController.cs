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
using System.Collections.Generic;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class TotalScoresController : ControllerBase
{
    private readonly UserContext _context;
    private readonly ILogger<TotalScoresController> _logger;
    private readonly IConfiguration _configuration;

    public TotalScoresController(UserContext context, ILogger<TotalScoresController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

[HttpGet("user/me/dates")]
[Authorize]
public async Task<ActionResult<List<object>>> GetTotalScoreDatesAndIdsByLoggedInUser()
{
    var nameIdentifierClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaim == null)
    {
        return BadRequest("No user is currently logged in.");
    }

    if (!int.TryParse(nameIdentifierClaim.Value, out var loggedInUserId))
    {
        return BadRequest("Invalid user ID.");
    }

    var datesAndIds = await _context.TotalScores
                                     .Where(score => score.UserId == loggedInUserId)
                                     .Select(score => new { score.Date, score.Id })
                                     .ToListAsync();

    return Ok(datesAndIds);
}


[HttpGet("user/me/dates/{id}")]
[Authorize]
public async Task<ActionResult<List<object>>> GetTotalScoreDatesAndIdsByLoggedInUser(int id)
{
    var nameIdentifierClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaim == null)
    {
        return BadRequest("No user is currently logged in.");
    }

    var datesAndIds = await _context.TotalScores
                                     .Where(score => score.UserId == id)
                                     .Select(score => new { score.Date, score.Id })
                                     .ToListAsync();

    return Ok(datesAndIds);
}


[HttpPost]
[Authorize]
public async Task<IActionResult> PostTotalScore(TotalScore totalScore)
{
    var nameIdentifierClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaim == null)
    {
        return BadRequest("No user is currently logged in.");
    }

    if (!int.TryParse(nameIdentifierClaim.Value, out var loggedInUserId))
    {
        return BadRequest("Invalid user ID.");
    }

    totalScore.UserId = loggedInUserId;

    // Set the current date
    totalScore.Date = DateOnly.FromDateTime(DateTime.Today);

    _context.TotalScores.Add(totalScore);

    // New code starts here
    var scoreValues = new Dictionary<string, int>
    {
        {"C", totalScore.ScoreValueC},
        {"S", totalScore.ScoreValueS},
        {"I", totalScore.ScoreValueI},
        {"D", totalScore.ScoreValueD},
    };

    var sortedScoreValues = scoreValues.OrderByDescending(x => x.Value).ToList();

    var boxValue = sortedScoreValues[0].Key + sortedScoreValues[1].Key.ToLower();

    var user = await _context.Users.FindAsync(loggedInUserId);
    if (user == null)
    {
        return BadRequest("User not found.");
    }

    user.Box = boxValue;

    _context.Users.Update(user);
    // New code ends here

    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetTotalScoreByUser), new { id = totalScore.Id }, totalScore);
}


[HttpGet("user/me/pp/{id}")]
[Authorize]
public async Task<ActionResult<TotalScore>> Pp(int id)
{

    // Find the TotalScore by ID and make sure it belongs to the logged-in user
    var totalScore = await _context.TotalScores
                                   .FirstOrDefaultAsync(score => score.Id == id && score.Id == id);

    if (totalScore == null)
    {
        return NotFound();
    }

    return totalScore;
}




[HttpGet("user/me/{id}")]
[Authorize]
public async Task<ActionResult<TotalScore>> GetTotalScoreByIdForLoggedInUser(int id)
{
    var nameIdentifierClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaim == null)
    {
        return BadRequest("No user is currently logged in.");
    }

    if (!int.TryParse(nameIdentifierClaim.Value, out var loggedInUserId))
    {
        return BadRequest("Invalid user ID.");
    }

    // Find the TotalScore by ID and make sure it belongs to the logged-in user
    var totalScore = await _context.TotalScores
                                   .FirstOrDefaultAsync(score => score.Id == id && score.UserId == loggedInUserId);

    if (totalScore == null)
    {
        return NotFound();
    }

    return totalScore;
}

    // API to get the score of any user by a specific date (Admin and Mod only)
    [HttpGet("user/{id}/{date}")]
    [Authorize(Roles = "Admin, Mod")]
    public async Task<ActionResult<TotalScore>> GetTotalScoreByDateForUser(int id, string date)
    {
        // Parsing date from string to DateOnly
        if (!DateOnly.TryParse(date, out var parsedDate))
        {
            return BadRequest("Invalid date format.");
        }

        var totalScore = await _context.TotalScores.FirstOrDefaultAsync(score => score.UserId == id && score.Date == parsedDate);

        if (totalScore == null)
        {
            return NotFound();
        }

        return totalScore;
    }


[HttpGet("user/me")]
[Authorize]
public async Task<ActionResult<TotalScore>> GetTotalScoresByLoggedInUser()
{
    var nameIdentifierClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaim == null)
    {
        return BadRequest("No user is currently logged in.");
    }

    if (!int.TryParse(nameIdentifierClaim.Value, out var loggedInUserId))
    {
        return BadRequest("Invalid user ID.");
    }

    var totalScore = await _context.TotalScores.FirstOrDefaultAsync(score => score.UserId == loggedInUserId);

    if (totalScore == null)
    {
        return NotFound();
    }

    return totalScore;
}



[HttpGet("user/{id}")]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult<TotalScore>> GetTotalScoreByUser(int id)
{
    // Use the user ID to find the TotalScore
    var totalScore = await _context.TotalScores.FirstOrDefaultAsync(score => score.UserId == id);

    if (totalScore == null)
    {
        return NotFound();
    }

    return totalScore;
}


    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<TotalScore>>> GetAllTotalScores()
    {
        return await _context.TotalScores.ToListAsync();
    }

}
