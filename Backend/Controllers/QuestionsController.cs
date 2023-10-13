using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly UserContext _context;

        public QuestionsController(UserContext context)
        {
            _context = context;
        }

        [HttpGet("{companyId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<QuestionDTO>>> GetQuestionsByCompany(int companyId)
        {
            var questions = await _context.Questions
                .Where(q => q.CompanyId == companyId)
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


        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Question>> PostQuestion(QuestionDTO questionDto)
        {
            var question = new Question
            {
                QuestionText = questionDto.QuestionText,
                CompanyId = questionDto.CompanyId,
                Answers = questionDto.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    ScoreValueC = a.ScoreValueC,
                    ScoreValueS = a.ScoreValueS,
                    ScoreValueI = a.ScoreValueI,
                    ScoreValueD = a.ScoreValueD
                }).ToList()
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
        }

[HttpPut]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateQuestions(List<QuestionDTO> questionDtoList)
{
    foreach (var questionDto in questionDtoList)
    {
        Question question;

        if (QuestionExists(questionDto.Id)) // Question exists, so we fetch it
        {
            question = await _context.Questions.Include(q => q.Answers).FirstOrDefaultAsync(q => q.Id == questionDto.Id);
            question.QuestionText = questionDto.QuestionText;
        }
        else // Question does not exist, so we create it
        {
            question = new Question
            {
                QuestionText = questionDto.QuestionText,
                CompanyId = questionDto.CompanyId,
            };

            _context.Questions.Add(question);
        }

        // Update or add new answers
        foreach (var answerDto in questionDto.Answers)
        {
            var existingAnswer = question.Answers.FirstOrDefault(a => a.Id == answerDto.Id);
            if (existingAnswer != null)
            {
                // Update existing answer
                existingAnswer.AnswerText = answerDto.AnswerText;
                existingAnswer.ScoreValueC = answerDto.ScoreValueC;
                existingAnswer.ScoreValueS = answerDto.ScoreValueS;
                existingAnswer.ScoreValueI = answerDto.ScoreValueI;
                existingAnswer.ScoreValueD = answerDto.ScoreValueD;
            }
            else
            {
                // Add new answer
                var newAnswer = new Answer
                {
                    AnswerText = answerDto.AnswerText,
                    ScoreValueC = answerDto.ScoreValueC,
                    ScoreValueS = answerDto.ScoreValueS,
                    ScoreValueI = answerDto.ScoreValueI,
                    ScoreValueD = answerDto.ScoreValueD,
                    QuestionId = question.Id
                };
                question.Answers.Add(newAnswer);
            }
        }

        // Remove deleted answers
        var deletedAnswerIds = question.Answers.Where(a => !questionDto.Answers.Any(dto => dto.Id == a.Id)).Select(a => a.Id).ToList();
        var deletedAnswers = _context.Answers.Where(a => deletedAnswerIds.Contains(a.Id));
        _context.Answers.RemoveRange(deletedAnswers);
    }

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        throw;
    }

    return NoContent();
}

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionExists(int id)
        {
            return _context.Questions.Any(q => q.Id == id);
        }

        private async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }
            return question;
        }
    }
}
