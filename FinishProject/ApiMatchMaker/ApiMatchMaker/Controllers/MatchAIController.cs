using MatchMakings.Core.DTOs;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using MatchMakings.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ApiMatchMaker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchAIController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly MatchService _matchService;

        public MatchAIController(DataContext context, MatchService matchService)
        {
            _context = context;
            _matchService = matchService;
        }

        [HttpPost("get-gpt-matches")]
        public async Task<IActionResult> GetMatchesFromGpt([FromBody] int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("משתמש לא נמצא");

            // זיהוי מגדר: מחפש התאמות מהמין השני
            string userGender = user is Male ? "Male" : user is Women ? "Women" : null;
            if (userGender == null)
                return BadRequest("משתמש אינו מועמד חוקי לשידוך");

            var oppositeGenderUsers = await _context.Users
                .Where(u =>
                    (userGender == "Male" && u is Women) ||
                    (userGender == "Women" && u is Male))
                .ToListAsync();

            var gptService = new GptService();

            var candidateJson = JsonSerializer.Serialize(user);
            var allCandidatesJson = JsonSerializer.Serialize(oppositeGenderUsers);

            var result = await gptService.GetMatchesFromGptAsync(candidateJson, allCandidatesJson);
            return Ok(result);
        }
    }


}

