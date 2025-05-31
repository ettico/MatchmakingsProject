using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Service
{
    public class NoteService : INoteService
    {
        readonly private INoteRepository _NoteRepository;

        public NoteService(INoteRepository noteRepository)
        {
            _NoteRepository = noteRepository ?? throw new ArgumentNullException(nameof(noteRepository));
        }

        public async Task<Note> AddNoteAsync(Note note)
        {
            await _NoteRepository.AddNoteAsync(note);
            return note;
        }

        public async Task<Note> DeleteNoteAsync(int id)
        {
            return await _NoteRepository.DeleteNoteAsync(id);
        }

        public async Task<Note> GetNoteByIdAsync(int id)
        {
            return await _NoteRepository.GetNoteByIdAsync(id);
        }

        public async Task<IEnumerable<Note>> GetListOfNoteAsync()
        {
            return await _NoteRepository.GetListOfNoteAsync();

        }

        public async Task<Note> UpdateNoteAsync(int id, Note note)
        {
            return await _NoteRepository.UpdateNoteAsync(id, note);
        }
    }
}
