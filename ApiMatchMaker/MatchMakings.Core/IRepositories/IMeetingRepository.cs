using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.IRepositories
{
    public interface INoteRepository
    {
        public Task<IEnumerable<Note>> GetListOfNoteAsync();
        public Task<Note> GetNoteByIdAsync(int id);
        public Task<Note> AddNoteAsync(Note note);
        public Task<Note> DeleteNoteAsync(int id);
        public Task<Note> UpdateNoteAsync(int id, Note note);
    }
}
