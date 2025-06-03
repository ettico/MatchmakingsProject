using ApiMatchMaker.PostModels;
using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiMatchMaker.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IServiceUser _userService;
        private readonly IMapper _mapper;
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleRepository _roleRpository;
        public AuthController(IAuthService authService, IServiceUser userService, IMapper mapper, IUserRoleService userRoleService, IRoleRepository roleRpository)
        {
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
            _userRoleService = userRoleService;
            _roleRpository = roleRpository;
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDTO model)
        {
            var user = await _userService.GetUserByEmailAsync(model.Username);
            if (user.Role == "Admin")
            {
                var token = _authService.GenerateToken(user);
                return Ok(new { Token = token, User = user });
            }

            else if (user.Role == "MatchMaker")
            {
                var token = _authService.GenerateToken(user);
                return Ok(new { Token = token, User = user });
            }

            else if (user.Role == "Women")
            {
                var token = _authService.GenerateToken(user);
                return Ok(new { Token = token, User = user });
            }
            else if (user.Role == "Male")
            {
                var token = _authService.GenerateToken(user);
                return Ok(new { Token = token, User = user });
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDTO model)
        {
            if (model == null)
            {
                return Conflict("User is not valid");
            }

            try
            {
                var newUser = await _authService.RegisterUser(model); // ← זו הפונקציה הנכונה
                                                                      // שומרת את הסוג הנכון (MatchMaker, Male, Women)
                int roleId = await _roleRpository.GetIdByRoleAsync(model.Role);
                if (roleId == -1)
                {
                    return BadRequest("Role not found.");
                }

                var userRole = await _userRoleService.AddAsync(model.Role, newUser.Id);
                if (userRole == null)
                    return BadRequest("Error assigning role to user.");
                var userDto = _mapper.Map<BaseUserDTO>(newUser);
                var token = _authService.GenerateToken(userDto); // העבירי את ה־User המלא, לא DTO

                return Ok(new { Token = token, User = newUser });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
