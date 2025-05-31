using ApiMatchMaker.PostModels;
using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Data;
using Microsoft.AspNetCore.Authorization;

//using MatchMakings.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiMatchMaker.Controllers
{ 
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyDetailsController : ControllerBase
    {
       
       
        private readonly IFamilyDetailsService _familyDetailsService;
        //private DataContext _context;

        private readonly IMapper _mapper;
        public FamilyDetailsController(IFamilyDetailsService familyDetailsService, IMapper mapper)
        {
            if (familyDetailsService == null)
            {
                throw new ArgumentNullException(nameof(familyDetailsService));
            }
            _familyDetailsService = familyDetailsService;
            _mapper = mapper;
        }
        // GET: api/<CustomerController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _familyDetailsService.GetListOfFamilyDetailsAsync();
            var fmDTO = _mapper.Map<IEnumerable<FamilyDetailsDTO>>(list);
            return Ok(fmDTO);
        }

        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FamilyDetails>> Get(int id)
        {
            var fm = await _familyDetailsService.GetFamilyDetailsByIdAsync(id);
            var fmDTO = _mapper.Map<FamilyDetailsDTO>(fm);
            return Ok(fmDTO);
        }

        //POST api/<CustomerController>
        [HttpPost]
        public async Task<ActionResult<FamilyDetails>> Post([FromBody] FamilyDateilsPostmodels f)
        {
            var fm = new FamilyDetails
            {
                FatherName = f.FatherName,
                FatherOrigin = f.FatherOrigin,
                FatherYeshiva = f.FatherYeshiva,
                FatherAffiliation = f.FatherAffiliation,
                FatherOccupation = f.FatherOccupation,
                MotherName =f.MotherName,
                MotherOrigin =f.MotherOrigin,
                MotherGraduateSeminar =f.FatherYeshiva,
                MotherPreviousName =f.MotherPreviousName,
                MotherOccupation =f.MotherOccupation,
                ParentsStatus =f.ParentsStatus,
                HealthStatus =f.HealthStatus,
                FamilyRabbi =f.FamilyRabbi,
                FamilyAbout =f.FamilyAbout,
                MaleId =f.MaleId,
                WomenId =f.WomenId
            };
            return await _familyDetailsService.AddFamilyDetailsAsync(fm);
        }

        //PUT api/<CustomerController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FamilyDetails>> Put(int id, [FromBody] FamilyDateilsPostmodels f)
        {
            var fm = new FamilyDetails
            {
                FatherName = f.FatherName,
                FatherOrigin = f.FatherOrigin,
                FatherYeshiva = f.FatherYeshiva,
                FatherAffiliation = f.FatherAffiliation,
                FatherOccupation = f.FatherOccupation,
                MotherName = f.MotherName,
                MotherOrigin = f.MotherOrigin,
                MotherGraduateSeminar = f.FatherYeshiva,
                MotherPreviousName = f.MotherPreviousName,
                MotherOccupation = f.MotherOccupation,
                ParentsStatus = f.ParentsStatus,
                HealthStatus = f.HealthStatus,
                FamilyRabbi = f.FamilyRabbi,
                FamilyAbout = f.FamilyAbout,
                MaleId = f.MaleId,
                WomenId = f.WomenId
            };

            return await _familyDetailsService.UpdateFamilyDetailsAsync(id, fm);
        }

        // DELETE api/<CustomerController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FamilyDetails>> Delete(int id)
        {
            return await _familyDetailsService.DeleteFamilyDetailsAsync(id);
        }
    }
}
