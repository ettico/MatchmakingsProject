using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiMatchMaker.Controllers
{
    //[Authorize(Policy = "AdminOnly")] // 👑 רק המנהל יכול לגשת לפה!
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthService _authService;
        private readonly IServiceUser _userService;

        public AdminController(IConfiguration config, IAuthService authService, IServiceUser userService)
        {
            _config = config;
            _authService = authService;
            _userService = userService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginDTO loginDto)
        {
            Console.WriteLine($"🔹 מנסה להתחבר עם: {loginDto.Username}");
            Console.WriteLine($"🔹 סיסמה שהוזנה: {loginDto.Password}");
            Console.WriteLine($"🔹 סיסמה במערכת: {_config["Admin:Password"]}");

            if (loginDto.Username == _config["Admin:Username"] && loginDto.Password == _config["Admin:Password"])
            {
                var user = await _userService.GetUserByEmailAsync(loginDto.Username);

                var token = _authService.GenerateToken(user);

                Console.WriteLine("✅ התחברות הצליחה! נוצר טוקן.");
                Console.WriteLine($"Configured Key: {_config["Jwt:Key"]}");
                return Ok(new { Token = token, Role = "Admin" });
            }

            Console.WriteLine("❌ שם משתמש או סיסמה שגויים!");
            return Unauthorized("שם משתמש או סיסמה שגויים!");
        }
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _authService.GetUserById(id);
            if (user == null) return NotFound("❌ משתמש לא נמצא!");

            await _authService.DeleteUser(id);
            return Ok("✅ המשתמש נמחק בהצלחה!");
        }
    }
}
