using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YamlUploadController : ControllerBase
    {
        private readonly UserContext _context;

        public YamlUploadController(UserContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostQuestionData([FromBody] List<QuestionDTO> questionDTOs)
        {
            try
            {
                foreach (var questionDTO in questionDTOs)
                {
                var question = new Question 
                { 
                    QuestionText = questionDTO.QuestionText,
                    CompanyId = questionDTO.CompanyId // Add this line
                };
                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                    foreach (var answerDTO in questionDTO.Answers)
                    {
                        var answer = new Answer
                        {
                            QuestionId = question.Id,
                            AnswerText = answerDTO.AnswerText,
                            ScoreValueD = answerDTO.ScoreValueD,
                            ScoreValueI = answerDTO.ScoreValueI,
                            ScoreValueS = answerDTO.ScoreValueS,
                            ScoreValueC = answerDTO.ScoreValueC,
                        };
                        _context.Answers.Add(answer);
                    }
                }
                await _context.SaveChangesAsync();
                return Ok("Questions and answers from YAML file successfully saved to database");
            }
            catch (Exception e)
            {
                return BadRequest("An error occurred: " + e.Message);
            }
        }
private readonly ILogger<YamlUploadController> _logger;
        [HttpPost("YamlUploadForType2")]
        [Authorize(Roles = "Admin")]
            public async Task<IActionResult> PostQuestionDataForType2([FromBody] List<QuestionOpen> questionDTOs)
            {
                try
                {
                    foreach (var questionDTO in questionDTOs)
                    {
                        var question = new QuestionOpen 
                        { 
                            QuestionText = questionDTO.QuestionText,
                            CompanyId = questionDTO.CompanyId,
                            Answers = questionDTO.Answers?.Select(a => new AnswerOpen { AnswerText = a.AnswerText }).ToList() // Handle potential null value here
                        };
                        _context.QuestionOpen.Add(question);
                    }
                    await _context.SaveChangesAsync();
                    return Ok("Questions and answers from YAML file for type 2 company successfully saved to database");
                }
                catch (Exception e)
                {
                    // Log the exception details
                    _logger.LogError(e, "An error occurred while processing the request.");
                    
                    // Respond with a detailed error message for debugging purposes.
                    // Be aware that in a production system, you should not expose internal error details like this.
                    return BadRequest("An error occurred: " + e.Message);
                }

            }

    }
}
