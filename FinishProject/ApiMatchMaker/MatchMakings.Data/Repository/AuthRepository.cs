using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
    public class AuthRepository:IAuthRepository
    {
        private readonly DataContext _dataContext;

        public AuthRepository(DataContext dataContext)
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
    }
}
