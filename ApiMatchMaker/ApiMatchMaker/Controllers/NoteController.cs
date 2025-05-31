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
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {


        private readonly INoteService _noteService;
        //private DataContext _context;

        private readonly IMapper _mapper;
        public NoteController(INoteService noteService, IMapper mapper)
        {
            _noteService = noteService;
            _mapper = mapper;
        }
        // GET: api/<CustomerController>
        [Authorize(Policy = "MatchmakerOrAdmin")]
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _noteService.GetListOfNoteAsync();
            var noteDTO = _mapper.Map<IEnumerable<NoteDTO>>(list);
            return Ok(noteDTO);
        }
        [Authorize(Policy = "MatchmakerOrAdmin")]
        // GET api/<CustomerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> Get(int id)
        {
            var note = await _noteService.GetNoteByIdAsync(id);
            var noteDTO = _mapper.Map<NoteDTO>(note);
            return Ok(noteDTO);
        }

        //POST api/<CustomerController>
        [Authorize(Policy = "MatchmakerOrAdmin")]
        [HttpPost]
        public async Task<ActionResult<Note>> Post([FromBody] NoteDTO n)
        {
            var note = new Note {  MatchMakerId = n.MatchMakerId, UserId = n.UserId, Content = n.Content, CreatedAt = n.CreatedAt };
            return await _noteService.AddNoteAsync(note);
        }

        //PUT api/<CustomerController>/5
        [Authorize(Policy = "MatchmakerOrAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Note>> Put(int id, [FromBody] NoteDTO n)
        {
            var note = new Note {  MatchMakerId = n.MatchMakerId, UserId   = n.UserId, Content = n.Content, CreatedAt = n.CreatedAt };

            return await _noteService.UpdateNoteAsync(id, note);
        }

        // DELETE api/<CustomerController>/5
        [Authorize(Policy = "MatchmakerOrAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Note>> Delete(int id)
        {
            return await _noteService.DeleteNoteAsync(id);
        }
    }
}
