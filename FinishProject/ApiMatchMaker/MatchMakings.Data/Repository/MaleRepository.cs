﻿using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
    public class MaleRepository : IMaleRepository
    {
        private readonly DataContext _dataContext;

        public MaleRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IEnumerable<Male>> GetListOfMaleAsync()
        {
            return await _dataContext.Users
            .OfType<Male>() // מחזיר רק משתמשים מהסוג Man
            .Include(u => u.FamilyDetails)
            .ToListAsync();

        }

        public async Task<Male> GetMaleByIdAsync(int id)
        {
            var Male = await _dataContext.Users.OfType<Male>().FirstOrDefaultAsync(x => x.Id == id);
            if (Male == null)
            {
                throw new ArgumentException($"Male with id {id} was not found.");
            }
            return Male;
        }

        public async Task<Male> AddMaleAsync(Male Male)
        {
            _dataContext.Users.Add(Male);
            await _dataContext.SaveChangesAsync();
            return Male;
        }


        public async Task<Male> UpdateMaleAsync(int id, Male Male)
        {
            await DeleteMaleAsync(id);
            await _dataContext.SaveChangesAsync();
            return await AddMaleAsync(Male);


        }
        public async Task<Male> DeleteMaleAsync(int id)
        {
            var Male = await _dataContext.Users.OfType<Male>().FirstOrDefaultAsync(x => x.Id == id);
            if (Male == null)
            {
                throw new ArgumentException($"Male with id {id} was not found.");
            }
            _dataContext.Users.Remove(Male);
            await _dataContext.SaveChangesAsync();
            return Male;
        }
    }
}
