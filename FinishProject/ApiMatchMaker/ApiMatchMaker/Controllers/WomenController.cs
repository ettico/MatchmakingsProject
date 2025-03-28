using ApiMatchMaker.PostModels;
using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Data;
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
    public class WomenController : ControllerBase
    {
       
        private readonly IWomenService _womenService;
        //private DataContext _context;

        private readonly IMapper _mapper;
        public WomenController(IWomenService womenService, IMapper mapper)
        {
            _womenService = womenService;
            _mapper = mapper;
        }
        // GET: api/<CustomerController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _womenService.GetListOfWomenAsync();
            var womenDTO = _mapper.Map<IEnumerable<WomenDTO>>(list);
            return Ok(womenDTO);
        }

        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Women>> Get(int id)
        {
            var women = await _womenService.GetWomenByIdAsync(id);
            var womenDTO = _mapper.Map<WomenDTO>(women);
            return Ok(womenDTO);
        }

        //POST api/<CustomerController>
        [HttpPost]
        public async Task<ActionResult<Women>> Post([FromBody] WomenPostModels w)
        {
            var women = new Women
            {
                Country = w.Country,
                City = w.City,
                Address = w.Address,
                Tz = w.Tz,
                Class = w.Class,
                AnOutsider = w.AnOutsider,
                BackGround = w.BackGround,
                Openness = w.Openness,
                BurnDate = w.BurnDate,
                Age = w.Age,
                HealthCondition = w.HealthCondition,
                Status = w.Status,
                StatusVacant = w.StatusVacant,
                PairingType = w.PairingType,
                Height = w.Height,
                GeneralAppearance = w.GeneralAppearance,
                FacePaint = w.FacePaint,
                Appearance = w.Appearance,
                Phone = w.Phone,
                Email = w.Email,
                FatherPhone = w.FatherPhone,
                MotherPhone = w.MotherPhone,
                MoreInformation = w.MoreInformation,
                HeadCovering =w.HeadCovering,
                HighSchool =w.HighSchool,
                Seminar =w.Seminar,
                StudyPath =w.StudyPath,
                AdditionalEducationalInstitution =w.AdditionalEducationalInstitution,
                CurrentOccupation =w.CurrentOccupation,
                Club =w.Club,
                AgeFrom =w.AgeFrom,
                AgeTo = w.Age,
                ImportantTraitsInMe =w.ImportantTraitsInMe,
                ImportantTraitsIMLookingFor =w.ImportantTraitsIMLookingFor,
                PreferredSittingStyle =w.PreferredSittingStyle,
                InterestedInBoy =w.InterestedInBoy,
                DrivingLicense =w.DrivingLicense,
                Smoker =w.Smoker,
                Beard = w.Beard,
                Hat =w.Hat,
                Suit = w.Suit,
                Occupation =w.Occupation
            };
            return await _womenService.AddWomenAsync(women);
        }

        //PUT api/<CustomerController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Women>> Put(int id, [FromBody] WomenPostModels w)
        {
            var women = new Women
            {
                Country = w.Country,
                City = w.City,
                Address = w.Address,
                Tz = w.Tz,
                Class = w.Class,
                AnOutsider = w.AnOutsider,
                BackGround = w.BackGround,
                Openness = w.Openness,
                BurnDate = w.BurnDate,
                Age = w.Age,
                HealthCondition = w.HealthCondition,
                Status = w.Status,
                StatusVacant = w.StatusVacant,
                PairingType = w.PairingType,
                Height = w.Height,
                GeneralAppearance = w.GeneralAppearance,
                FacePaint = w.FacePaint,
                Appearance = w.Appearance,
                Phone = w.Phone,
                Email = w.Email,
                FatherPhone = w.FatherPhone,
                MotherPhone = w.MotherPhone,
                MoreInformation = w.MoreInformation,
                HeadCovering = w.HeadCovering,
                HighSchool = w.HighSchool,
                Seminar = w.Seminar,
                StudyPath = w.StudyPath,
                AdditionalEducationalInstitution = w.AdditionalEducationalInstitution,
                CurrentOccupation = w.CurrentOccupation,
                Club = w.Club,
                AgeFrom = w.AgeFrom,
                AgeTo = w.Age,
                ImportantTraitsInMe = w.ImportantTraitsInMe,
                ImportantTraitsIMLookingFor = w.ImportantTraitsIMLookingFor,
                PreferredSittingStyle = w.PreferredSittingStyle,
                InterestedInBoy = w.InterestedInBoy,
                DrivingLicense = w.DrivingLicense,
                Smoker = w.Smoker,
                Beard = w.Beard,
                Hat = w.Hat,
                Suit = w.Suit,
                Occupation = w.Occupation
            };
            return await _womenService.UpdateWomenAsync(id, women);
        }

        // DELETE api/<CustomerController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Women>> Delete(int id)
        {
            return await _womenService.DeleteWomenAsync(id);
        }
    }
}
