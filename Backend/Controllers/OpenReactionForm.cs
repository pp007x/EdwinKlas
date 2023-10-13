using LoginApi.Data;
using LoginApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
// using DocumentFormat.OpenXml.Packaging;
// using DocumentFormat.OpenXml.Wordprocessing;
using System.Xml.Linq;
// using NPOI.XWPF.UserModel;
// using DocumentFormat.OpenXml.Packaging;
// using OpenXmlPowerTools;
namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpenReactionFormController : ControllerBase
    {
        private readonly UserContext _context;

        public OpenReactionFormController(UserContext context)
        {
            _context = context;
        }


        [HttpGet("company/{companyId}")]
        [Authorize]
        public async Task<ActionResult<List<QuestionOpenDTO>>> GetCompanyQuestions(int companyId)
        {
            var companyQuestions = await _context.QuestionOpen
                .Where(q => q.CompanyId == companyId)
                .Include(q => q.Answers)
                .ToListAsync();

            if (!companyQuestions.Any())
            {
                return NotFound("No questions found for the provided company ID.");
            }

            var questionOpenDTOs = companyQuestions.Select(q => new QuestionOpenDTO
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                CompanyId = q.CompanyId,
                Answers = q.Answers.Select(a => new AnswerOpenDTO
                {
                    Id = a.Id,
                    QuestionOpenId = a.QuestionOpenId,
                    AnswerText = a.AnswerText
                }).ToList()
            }).ToList();

            return questionOpenDTOs;
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<IActionResult> DeleteOpenQuestion(int id)
        {
            var questionOpen = await _context.QuestionOpen.FindAsync(id);
            if (questionOpen == null)
            {
                return NotFound();
            }

            _context.QuestionOpen.Remove(questionOpen);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("companyOpen/{companyId}")]
        [Authorize]
        public async Task<ActionResult<List<QuestionOpenDTO>>> GetOpenQuestionsCompany(int companyId)
        {
            var openQuestions = await _context.QuestionOpen
                .Where(q => q.CompanyId == companyId)
                .Include(q => q.Answers)
                .ToListAsync();

            var questionOpenDTOs = openQuestions.Select(q => new QuestionOpenDTO
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                CompanyId = q.CompanyId,
                Answers = q.Answers.Select(a => new AnswerOpenDTO
                {
                    Id = a.Id,
                    QuestionOpenId = a.QuestionOpenId,
                    AnswerText = a.AnswerText
                }).ToList()
            }).ToList();

            return questionOpenDTOs;
        }

        private bool QuestionOpenExists(int questionId)
        {
            return _context.QuestionOpen.Any(q => q.Id == questionId);
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<IActionResult> UpdateOpenQuestions(List<QuestionOpenDTO> questionDtoList)
        {
            foreach (var questionDto in questionDtoList)
            {
                QuestionOpen question;

                if (QuestionOpenExists(questionDto.Id)) // Question exists, so we fetch it
                {
                    question = await _context.QuestionOpen.FirstOrDefaultAsync(q => q.Id == questionDto.Id);
                    question.QuestionText = questionDto.QuestionText;
                }
                else // Question does not exist, so we create it
                {
                    question = new QuestionOpen
                    {
                        QuestionText = questionDto.QuestionText,
                        CompanyId = questionDto.CompanyId,
                    };

                    _context.QuestionOpen.Add(question);
                }
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

        [HttpGet("open")]
        [Authorize]
        public async Task<ActionResult<List<QuestionOpenDTO>>> GetOpenQuestions()
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

            var openQuestions = await _context.QuestionOpen
                .Where(q => q.CompanyId == user.CompanyId)
                .Include(q => q.Answers)
                .ToListAsync();

            var questionOpenDTOs = openQuestions.Select(q => new QuestionOpenDTO
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                CompanyId = q.CompanyId,
                Answers = q.Answers.Select(a => new AnswerOpenDTO
                {
                    Id = a.Id,
                    QuestionOpenId = a.QuestionOpenId,
                    AnswerText = a.AnswerText
                }).ToList()
            }).ToList();

            return questionOpenDTOs;
        }

        [HttpGet("user/me/answers")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OpenAnswers>>> GetAnswersByLoggedInUser()
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

            var userAnswers = await _context.OpenAnswers.Where(answer => answer.UserId == loggedInUserId).ToListAsync();

            if (!userAnswers.Any())
            {
                return NotFound();
            }

            return userAnswers;
        }

        [HttpGet("user/{id}")]
        [Authorize(Roles = "Admin, Mod")]
        public async Task<ActionResult<IEnumerable<OpenAnswers>>> GetAnswersByUser(int id)
        {
            var userAnswers = await _context.OpenAnswers.Where(answer => answer.UserId == id).ToListAsync();

            if (!userAnswers.Any())
            {
                return NotFound();
            }

            return userAnswers;
        }

        [HttpPost("openanswers")]
        [Authorize]
        public async Task<ActionResult> PostOpenAnswers(List<OpenAnswerDTO> openAnswerDTOs)
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

            // Generate a random session ID
            Random random = new Random();
            int newSession;
            do
            {
                newSession = random.Next(int.MinValue, int.MaxValue);
            } while (_context.OpenAnswers.Any(a => a.Session == newSession));

            var openAnswers = openAnswerDTOs.Select(dto => new OpenAnswers
            {
                QuestionOpenId = dto.QuestionId,
                AnswerText = dto.AnswerText,
                UserId = loggedInUserId,
                Session = newSession,  // assign the session to the answer
                Date = DateTime.Now  // set the date to the current datetime
            }).ToList();
            await _context.OpenAnswers.AddRangeAsync(openAnswers);
            await _context.SaveChangesAsync();

            return Ok();
        }


// public void UpdateWordDocument(string filePath, string newFilePath, Dictionary<string, string> replacements)
// {
//     // Copy the original document to a new file
//     System.IO.File.Copy(filePath, newFilePath, true);

//     // Now open and modify the copy, not the original
//     using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(newFilePath, true))
//     {
//         foreach (var replacement in replacements)
//         {
//             // Perform the replacements on the document
//             TextReplacer.SearchAndReplace(wordDoc, replacement.Key, replacement.Value, false);
//         }
//     }
// }


[HttpGet("updatedWordDocument")]
[Authorize]
public async Task<IActionResult> GetUpdatedWordDocument()
{
    var filePath = "openvragen.docx";
    var newFilePath = "updatedOpenvragen.docx";

    var replacements = new Dictionary<string, string>();

    // Get the answers of the logged in user
    var userAnswers = await GetAnswersByLoggedInUser();
    if (userAnswers.Value == null)
    {
        // Handle error if no answers are found
        return NotFound("No answers found for the logged in user.");
    }

    // Create replacements dictionary
    int answerCount = 1;
    foreach (var answer in userAnswers.Value)
    {
        Console.WriteLine(answer.AnswerText);
        Console.WriteLine(answerCount);
        replacements.Add($"Answer{answerCount++}", answer.AnswerText);
    }

    // UpdateWordDocument(filePath, newFilePath, replacements);

    var updatedWordDocumentBytes = System.IO.File.ReadAllBytes(newFilePath);
    return File(updatedWordDocumentBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}



    }
}
