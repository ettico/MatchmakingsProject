﻿using AutoMapper;
using MatchMakings.Core.DTOs;
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
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService,IMapper mapper)
        {
            _mapper = mapper;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _authService.AuthenticateUser(loginDto);
            if (user == null) return Unauthorized("שם משתמש או סיסמה שגויים");

            var token = _authService.GenerateToken(user);
            return Ok(new { Token = token, Role = user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            var user = await _authService.RegisterUser(registerDto);
            return Ok(new { Message = "נרשמת בהצלחה!", User = user });
        }
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _authService.GetListOfMaleAsync();
            var maleDTO = _mapper.Map<IEnumerable<MaleDTO>>(list);
            return Ok(maleDTO);
        }

    }
}
