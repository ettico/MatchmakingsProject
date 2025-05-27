using Amazon.Auth.AccessControlPolicy;
using ApiMatchMaker.Controllers;
using ApiMatchMaker.PostModels;
using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiProject.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MaleController : ControllerBase
    {

     
       

        //private DataContext _context;

        private readonly IMaleService _maleService;
        private readonly IMapper _mapper;
        public MaleController(IMaleService maleService, IMapper mapper)
        {
            _maleService = maleService;
           _mapper = mapper;
        }
        // GET: api/<CustomerController>
        //[Authorize(Policy = "getMales")]
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _maleService.GetListOfMaleAsync();
            var maleDTO = _mapper.Map<IEnumerable<MaleDTO>>(list);
            return Ok(maleDTO);
        }

        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Male>> Get(int id)
        {
            var male = await _maleService.GetMaleByIdAsync(id);
            var maleDTO = _mapper.Map<MaleDTO>(male);
            return Ok(maleDTO);
        }

        //POST api/<CustomerController>
        [HttpPost]
        public async Task<ActionResult<Male>> Post([FromBody] MalePostModels m)
        {
            var male = new Male
            {
                Country =m.Country,
                City =m.City ,
                Address =m.Address ,
                Tz =m.Tz ,
                Class =m.Class,
                AnOutsider =m.AnOutsider,
                BackGround =m.BackGround,
                Openness =m.Openness,
                BurnDate =m.BurnDate,
                Age =m.Age,
                HealthCondition =m.HealthCondition,
                Status =m.Status,
                StatusVacant =m.StatusVacant,
                PairingType =m.PairingType,
                Height =m.Height,
                GeneralAppearance =m.GeneralAppearance,
                FacePaint =m.FacePaint,
                Appearance =m.Appearance,
                Phone =m.Phone,
                Email =m.Email,
                FatherPhone =m.FatherPhone,
                MotherPhone =m.MotherPhone,
                MoreInformation =m.MoreInformation,
                DriversLicense =m.DriversLicense,
                Smoker =m.Smoker,
                Beard =m.Beard,
                Hot =m.Hot,
                Suit =m.Suit,
                SmallYeshiva = m.SmallYeshiva,
                BigYeshiva = m.BigYeshiva,
                Kibbutz = m.Kibbutz,
                Occupation = m.Occupation,
                ExpectationsFromPartner =m.ExpectationsFromPartner,
                Club =m.Club,
                AgeFrom =m.AgeFrom,
                AgeTo =m.AgeTo,
                ImportantTraitsInMe =m.ImportantTraitsIAmLookingFor,
                ImportantTraitsIAmLookingFor =m.ImportantTraitsIAmLookingFor,
                PreferredSeminarStyle =m.PreferredSeminarStyle,
                PreferredProfessionalPath =m.PreferredProfessionalPath,
                HeadCovering =m.HeadCovering
        };
            return await _maleService.AddMaleAsync(male);
        }

        // PUT api/<CustomerController>/5
        //[HttpPut("{id}")]
        //public async Task<ActionResult<Male>> Put(int id, [FromBody] MalePostModels m)
        //{
        //    //var customer = new Customer { castName = c.castName, castAddress = c.castAddress, castPhone = c.castPhone, castEmail = c.castEmail, VolunteerId = c.VolunteerId };
        //    var male = new Male
        //    {
        //        Country = m.Country,
        //        City = m.City,
        //        Address = m.Address,
        //        Tz = m.Tz,
        //        Class = m.Class,
        //        AnOutsider = m.AnOutsider,
        //        BackGround = m.BackGround,
        //        Openness = m.Openness,
        //        BurnDate = m.BurnDate,
        //        Age = m.Age,
        //        HealthCondition = m.HealthCondition,
        //        Status = m.Status,
        //        StatusVacant = m.StatusVacant,
        //        PairingType = m.PairingType,
        //        Height = m.Height,
        //        GeneralAppearance = m.GeneralAppearance,
        //        FacePaint = m.FacePaint,
        //        Appearance = m.Appearance,
        //        Phone = m.Phone,
        //        Email = m.Email,
        //        FatherPhone = m.FatherPhone,
        //        MotherPhone = m.MotherPhone,
        //        MoreInformation = m.MoreInformation,
        //        DriversLicense = m.DriversLicense,
        //        Smoker = m.Smoker,
        //        Beard = m.Beard,
        //        Hot = m.Hot,
        //        Suit = m.Suit,
        //        SmallYeshiva = m.SmallYeshiva,
        //        BigYeshiva = m.BigYeshiva,
        //        Kibbutz = m.Kibbutz,
        //        Occupation = m.Occupation,
        //        ExpectationsFromPartner = m.ExpectationsFromPartner,
        //        Club = m.Club,
        //        AgeFrom = m.AgeFrom,
        //        AgeTo = m.AgeTo,
        //        ImportantTraitsInMe = m.ImportantTraitsIAmLookingFor,
        //        ImportantTraitsIAmLookingFor = m.ImportantTraitsIAmLookingFor,
        //        PreferredSeminarStyle = m.PreferredSeminarStyle,
        //        PreferredProfessionalPath = m.PreferredProfessionalPath,
        //        HeadCovering = m.HeadCovering
        //    };
        //    return await _maleService.UpdateMaleAsync(id, male);
        //}

        //[HttpPut("{id}")]
        //public async Task<ActionResult<MaleDTO>> Put(int id, [FromBody] MalePostModels m)
        //{
        //    var maleFromBody = _mapper.Map<Male>(m); // Mapping מה-PostModel ל-Entity
        //    var updatedMale = await _maleService.UpdateMaleAsync(id, maleFromBody);

        //    if (updatedMale == null)
        //        return NotFound();
        //    var maleDTO = _mapper.Map<MaleDTO>(updatedMale); // נחזיר ללקוח DTO
        //    return Ok(maleDTO);
        //}
        [HttpPut("{id}")]
        public async Task<ActionResult<MaleDTO>> Put(int id, [FromBody] MalePostModels m)
        {
            // במקום להשתמש ב-AutoMapper, נבצע המרה ידנית
            var maleFromBody = new Male
            {
                // העתקת כל השדות מה-PostModel
                FirstName = m.FirstName,
                LastName = m.LastName,
                Username = m.Username,
                Password = m.Password,
                Role = m.Role,
                Country = m.Country,
                City = m.City,
                Address = m.Address,
                Tz = m.Tz,
                Class = m.Class,
                AnOutsider = m.AnOutsider,
                BackGround = m.BackGround,
                Openness = m.Openness,
                BurnDate = m.BurnDate,
                Age = m.Age,
                HealthCondition = m.HealthCondition,
                Status = m.Status,
                StatusVacant = m.StatusVacant,
                PairingType = m.PairingType,
                Height = m.Height,
                GeneralAppearance = m.GeneralAppearance,
                FacePaint = m.FacePaint,
                Appearance = m.Appearance,
                Phone = m.Phone,
                Email = m.Email,
                FatherPhone = m.FatherPhone,
                MotherPhone = m.MotherPhone,
                MoreInformation = m.MoreInformation,
                DriversLicense = m.DriversLicense,
                Smoker = m.Smoker,
                Beard = m.Beard,
                Hot = m.Hot,
                Suit = m.Suit,
                SmallYeshiva = m.SmallYeshiva,
                BigYeshiva = m.BigYeshiva,
                Kibbutz = m.Kibbutz,
                Occupation = m.Occupation,
                ExpectationsFromPartner = m.ExpectationsFromPartner,
                Club = m.Club,
                AgeFrom = m.AgeFrom,
                AgeTo = m.AgeTo,
                ImportantTraitsInMe = m.ImportantTraitsInMe,
                ImportantTraitsIAmLookingFor = m.ImportantTraitsIAmLookingFor,
                PreferredSeminarStyle = m.PreferredSeminarStyle,
                PreferredProfessionalPath = m.PreferredProfessionalPath,
                HeadCovering = m.HeadCovering
            };

            var updatedMale = await _maleService.UpdateMaleAsync(id, maleFromBody);
            if (updatedMale == null)
                return NotFound();

            var maleDTO = _mapper.Map<MaleDTO>(updatedMale); // נחזיר ללקוח DTO
            return Ok(maleDTO);
        }

        // DELETE api/<CustomerController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Male>> Delete(int id)
        {
            return await _maleService.DeleteMaleAsync(id);
        }
    }
}
