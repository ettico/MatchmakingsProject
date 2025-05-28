using Microsoft.AspNetCore.Mvc;
using MatchMakings.Service;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace ApiMatchMaker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchAIController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly GptService _gptService;

        public MatchAIController(DataContext context, GptService gptService)
        {
            _context = context;
            _gptService = gptService;
        }
        [AllowAnonymous] // כאן מאפשרים גישה ללא אימות
        [HttpPost("get-gpt-matches")]
        public async Task<ActionResult<List<object>>> GetMatchesFromGpt([FromBody] int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("משתמש לא נמצא");

            string userGender = user is Male ? "Male" : user is Women ? "Women" : null;
            if (userGender == null)
                return BadRequest("משתמש אינו מועמד חוקי לשידוך");

            var oppositeGenderUsers = await _context.Users
                .Where(u =>
                    (userGender == "Male" && u is Women) ||
                    (userGender == "Women" && u is Male))
                .ToListAsync();

            var candidateJson = JsonSerializer.Serialize(user);
            var allCandidatesJson = JsonSerializer.Serialize(oppositeGenderUsers.Select(u => new
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                // שדות נוספים רלוונטיים
            }));

            List<MatchResult> gptResults;
            try
            {
                gptResults = await _gptService.GetMatchesFromGptAsync(candidateJson, allCandidatesJson);
                if (gptResults == null)
                    return StatusCode(500, "קבלת תוצאות ריקות מ-GPT");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"שגיאה בעת קריאת GPT: {ex.Message}");
            }

            var enrichedResults = gptResults.Select(result =>
            {
                var matchedUser = oppositeGenderUsers.FirstOrDefault(u => u.Id == result.UserId);
                if (matchedUser == null) return null;

                return new
                {
                    UserId = matchedUser.Id,
                    FullName = $"{matchedUser.FirstName} {matchedUser.LastName}",
                    Score = result.Score,
                    Warnings = result.Comment
                };
            }).Where(x => x != null).ToList();

            return Ok(enrichedResults);
        }
    }
}
