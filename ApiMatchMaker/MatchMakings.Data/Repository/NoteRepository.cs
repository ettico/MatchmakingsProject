using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using static Azure.Core.HttpHeader;

namespace MatchMakings.Data.Repository
{
    public class NoteRepository: INoteRepository
    {
        private readonly DataContext _dataContext;

        public NoteRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IEnumerable<Note>> GetListOfNoteAsync()
        {
            return await _dataContext.Notes.Include(u => u.MatchMaker).ToListAsync();//todo
        }

        public async Task<Note> GetNoteByIdAsync(int id)
        {
            var note = await _dataContext.Notes.FirstOrDefaultAsync(x => x.Id == id);
            if (note == null)
            {
                throw new ArgumentException($"Meeting with id {id} was not found.");
            }
            return note;
        }

        public async Task<Note> AddNoteAsync(Note note)
        {
            _dataContext.Notes.Add(note);
            await _dataContext.SaveChangesAsync();
            return note;
        }


        public async Task<Note> UpdateNoteAsync(int id, Note note)
        {
            await DeleteNoteAsync(id);
            await _dataContext.SaveChangesAsync();
            return await AddNoteAsync(note);


        }
        public async Task<Note> DeleteNoteAsync(int id)
        {
            var Meeting = await _dataContext.Notes.FirstOrDefaultAsync(x => x.Id == id);
            if (Meeting == null)
            {
                throw new ArgumentException($"Meeting with id {id} was not found.");
            }
            _dataContext.Notes.Remove(Meeting);
            await _dataContext.SaveChangesAsync();
            return Meeting;
        }
    }
}
