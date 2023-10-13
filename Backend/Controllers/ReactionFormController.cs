using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ReactionFormController : ControllerBase
{
    private readonly UserContext _context;
    private readonly ILogger<ReactionFormController> _logger;
    private readonly IConfiguration _configuration;

    public ReactionFormController(UserContext context, ILogger<ReactionFormController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<QuestionDTO>>> GetQuestions()
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

        var user = await _context.Users.FindAsync(loggedInUserId);

        if (user == null)
        {
            return NotFound();
        }

        var questions = await _context.Questions
            .Where(q => q.CompanyId == user.CompanyId)
            .Include(q => q.Answers)
            .ToListAsync();

        var questionDTOs = questions.Select(q => new QuestionDTO
        {
            Id = q.Id,
            QuestionText = q.QuestionText,
            CompanyId = q.CompanyId,
            Answers = q.Answers.Select(a => new AnswerDTO
            {
                Id = a.Id,
                QuestionId = a.QuestionId,
                AnswerText = a.AnswerText,
                ScoreValueC = a.ScoreValueC,
                ScoreValueS = a.ScoreValueS,
                ScoreValueI = a.ScoreValueI,
                ScoreValueD = a.ScoreValueD
            }).ToList()
        }).ToList();

        return questionDTOs;
    }
}