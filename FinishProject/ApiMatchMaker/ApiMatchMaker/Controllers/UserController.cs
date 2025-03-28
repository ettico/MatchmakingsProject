using ApiMatchMaker.PostModels;
using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiMatchMaker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IContactService _contactService;
        private readonly IMapper _mapper;
        //private DataContext _context;


        public UserController(IContactService contactService, IMapper mapper)
        {
            _contactService = contactService;
            _mapper = mapper;
        }


        //[HttpGet]
        //public IActionResult GetContacts()
        //{
        //    var identity = HttpContext.User.Identity as ClaimsIdentity;
        //    if (identity == null) return Unauthorized("❌ אין זהות בבקשה!");

        //    var claims = identity.Claims;
        //    var userId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        //    var role = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

        //    Console.WriteLine($"🆔 User ID from Token: {userId}");
        //    Console.WriteLine($"🎭 Role from Token: {role}");

        //    return Ok($"✅ משתמש מחובר עם ID: {userId} ותפקיד: {role}");
        //}


        //GET: api/<CustomerController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _contactService.GetListOfContactAsync();
            var contactDTO = _mapper.Map<IEnumerable<ContactDTO>>(list);
            return Ok(contactDTO);
        }

        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> Get(int id)
        {
            var con = await _contactService.GetContactByIdAsync(id);
            var conDTO = _mapper.Map<ContactDTO>(con);
            return Ok(conDTO);
        }

        //POST api/<CustomerController>
        [HttpPost]
        public async Task<ActionResult<Contact>> Post([FromBody] ContactPostModels c)
        {
            var contact = new Contact { Name = c.Name, Phone = c.Phone, MaleId = c.MaleId, MatchMakerId = c.MatchMakerId, WomenId = c.WomenId };
            return await _contactService.AddContactAsync(contact);
        }

        //PUT api/<CustomerController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Contact>> Put(int id, [FromBody] ContactPostModels c)
        {
            //var customer = new Customer { castName = c.castName, castAddress = c.castAddress, castPhone = c.castPhone, castEmail = c.castEmail, VolunteerId = c.VolunteerId };
            var contact = new Contact { Name = c.Name, Phone = c.Phone, MaleId = c.MaleId, MatchMakerId = c.MatchMakerId, WomenId = c.WomenId };

            return await _contactService.UpdateContactAsync(id, contact);
        }

        // DELETE api/<CustomerController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Contact>> Delete(int id)
        {
            return await _contactService.DeleteContactAsync(id);
        }
    }
}
