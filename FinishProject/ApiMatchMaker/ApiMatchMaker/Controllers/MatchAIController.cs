using MatchMakings.Core.DTOs;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ApiMatchMaker.Controllers
{
    public class MatchAIController : Controller
    {
        private readonly DataContext _context;
        private readonly MatchService _matchService;

        public MatchAIController(DataContext context, MatchService matchService)
        {
            _context = context;
            _matchService = matchService;
        }

        [HttpGet("find-matches/{id}")]
        public async Task<IActionResult> FindMatches(int id, [FromQuery] int minScore = 70)
        {
            var mainCandidate = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (mainCandidate == null)
                return NotFound("Candidate not found");

            if (mainCandidate.Role != "Male" && mainCandidate.Role != "Women")
                return BadRequest("Only male or female candidates can be matched");

            var oppositeRole = mainCandidate.Role == "Male" ? "Women" : "Male";

            // טען את כל המועמדים מהמין השני
            var candidates = await _context.Users
                .Where(u => u.Role == oppositeRole)
                .ToListAsync();
            Console.WriteLine("user type: " + mainCandidate.GetType().Name);

            // חילוץ נתונים מהמועמד הראשי
            var userData = ExtractUserData(mainCandidate);

            // חילוץ נתונים מהמועמדים
            var candidateDataList = candidates
                .Select(c => {
                    var data = ExtractUserData(c);
                    data["Id"] = c.Id;
                    data["FirstName"] = c.FirstName;
                    data["LastName"] = c.LastName;
                    return data;
                }).ToList();

            // שליחה לשירות ההתאמה בפייתון
            var matches = await _matchService.GetMatchListAsync(new
            {
                user = userData,
                candidates = candidateDataList
            });

            Console.WriteLine("matches======"+matches);
            // סינון לפי ציון התאמה
            var filtered = matches
     .Where(m =>
         m.ContainsKey("score") &&
         ((JsonElement)m["score"]).ValueKind == JsonValueKind.Number &&
         m.ContainsKey("Id") &&
         m.ContainsKey("FirstName") &&
         m.ContainsKey("LastName")
     )
     .Select(m => new MatchResultDto
     {
         CandidateId = ((JsonElement)m["Id"]).GetInt32(),
         Name = ((JsonElement)m["FirstName"]).GetString() + " " + ((JsonElement)m["LastName"]).GetString(),
         Score = (int)((JsonElement)m["score"]).GetDouble()
     })
     .Where(r => r.Score >= minScore)
     .OrderByDescending(r => r.Score)
     .ToList();




            return Ok(filtered);
        }

        // פונקציה עזר שחולצת את הנתונים לפי סוג המשתמש
        private Dictionary<string, object?> ExtractUserData(BaseUser user)
        {
            return user switch
            {
                Male male => new Dictionary<string, object?>
                {
                    ["Age"] = male.Age,
                    ["Hobbies"] = male.Club,
                    ["Occupation"] = male.Occupation,
                    ["ImportantTraits"] = male.ImportantTraitsInMe
                },
                Women women => new Dictionary<string, object?>
                {
                    ["Age"] = women.Age,
                    ["Hobbies"] = women.Club,
                    ["Occupation"] = women.Occupation,
                    ["ImportantTraits"] = women.ImportantTraitsInMe
                },
                _ => new Dictionary<string, object?>()
            };
        }

    }
}
