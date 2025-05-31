using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using MatchMakings.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiProject.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MatchMakerController : ControllerBase
    {

      
      
        private readonly IMatchMakerService _matchMakerService;
        private readonly IMapper _mapper;
        public MatchMakerController(IMatchMakerService matchMakerService, IMapper mapper)
        {
            _matchMakerService = matchMakerService;
            _mapper = mapper;
        }
        // GET: api/<CustomerController>
        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _matchMakerService.GetListOfMatchMakerAsync();
            var mmDTO = _mapper.Map<IEnumerable<MatchMakerDTO>>(list);
            return Ok(mmDTO);
        }

        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MatchMaker>> Get(int id)
        {
            var mm = await _matchMakerService.GetMatchMakerByIdAsync(id);
            var mmDTO = _mapper.Map<MatchMakerDTO>(mm);
            return Ok(mmDTO);
        }

        //POST api/<CustomerController>
        [Authorize(Policy = "MatchmakerOrAdmin")]
        [HttpPost]
        public async Task<ActionResult<MatchMaker>> Post([FromBody] MatchMakerDTO m)
        {
            var mm = new MatchMaker()
            {
               
                MatchmakerName =m.MatchmakerName,
                IdNumber =m.IdNumber,
                BirthDate =m.BirthDate,
                Email =m.Email,
                Gender =m.Gender,
                City =m.City,
                Address =m.Address,
                MobilePhone =m.MobilePhone,
                LandlinePhone =m.LandlinePhone,
                PhoneType =m.PhoneType,
                PersonalClub =m.PersonalClub,
                Community =m.Community,
                Occupation =m.Occupation,
                PreviousWorkplaces =m. PreviousWorkplaces,
                IsSeminarGraduate =m.IsSeminarGraduate,
                HasChildrenInShidduchim = m.HasChildrenInShidduchim,
                ExperienceInShidduchim =m.ExperienceInShidduchim,
                LifeSkills = m.LifeSkills,
                YearsInShidduchim = m.YearsInShidduchim,
                IsInternalMatchmaker = m.IsInternalMatchmaker,
                PrintingNotes = m.PrintingNotes,
            };

            //var customer = new Contact { castName = c.castName, castAddress = c.castAddress, castPhone = c.castPhone, castEmail = c.castEmail, VolunteerId = c.VolunteerId };
            return await _matchMakerService.AddMatchMakerAsync(mm);
        }

        //PUT api/<CustomerController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<MatchMaker>> Put(int id, [FromBody] MatchMakerDTO m)
        {
            //var customer = new Customer { castName = c.castName, castAddress = c.castAddress, castPhone = c.castPhone, castEmail = c.castEmail, VolunteerId = c.VolunteerId };
            var mm = new MatchMaker()
            {
                FirstName = m.FirstName,
                LastName = m.LastName,
                Username = m.Username,
                Password = m.Password,
                Role = m.Role,
                MatchmakerName = m.MatchmakerName,
                IdNumber = m.IdNumber,
                BirthDate = m.BirthDate,
                Email = m.Email,
                Gender = m.Gender,
                City = m.City,
                Address = m.Address,
                MobilePhone = m.MobilePhone,
                LandlinePhone = m.LandlinePhone,
                PhoneType = m.PhoneType,
                PersonalClub = m.PersonalClub,
                Community = m.Community,
                Occupation = m.Occupation,
                PreviousWorkplaces = m.PreviousWorkplaces,
                IsSeminarGraduate = m.IsSeminarGraduate,
                HasChildrenInShidduchim = m.HasChildrenInShidduchim,
                ExperienceInShidduchim = m.ExperienceInShidduchim,
                LifeSkills = m.LifeSkills,
                YearsInShidduchim = m.YearsInShidduchim,
                IsInternalMatchmaker = m.IsInternalMatchmaker,
                PrintingNotes = m.PrintingNotes,
            };

            //return await _matchMakerService.UpdateMatchMakerAsync(id, mm);
            var updatedMale = await _matchMakerService.UpdateMatchMakerAsync(id, mm);
            if (updatedMale == null)
                return NotFound();

            var maleDTO = _mapper.Map<MatchMakerDTO>(updatedMale); // נחזיר ללקוח DTO
            return Ok(maleDTO);
        }

        // DELETE api/<CustomerController>/5
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<MatchMaker>> Delete(int id)
        {
            return await _matchMakerService.DeleteMatchMakerAsync(id);
        }
    }
}
