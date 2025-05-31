using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
    public class RepositoryUsers : IRepositoryUser
    {
        private readonly DataContext _dataContext;

        public RepositoryUsers(DataContext context)
        {
            _dataContext = context;
        }
        public async Task<IEnumerable<BaseUser>> GetAllAsync()
        {
            return await _dataContext.Users.ToListAsync();
        }

        public async Task<BaseUser> GetByIdAsync(int id)
        {
            return await _dataContext.Users.FindAsync(id);
        }

        public async Task<BaseUser> GetByUserByEmailAsync(string email)
        {
            return await _dataContext.Users.FirstOrDefaultAsync(u => u.Username == email);
        }
        public async Task<BaseUser> AddUserAsync(BaseUser user)
        {
            await _dataContext.Users.AddAsync(user);
            await _dataContext.SaveChangesAsync();
            return user;
        }
        public async Task<BaseUser> UpdateUserAsync(int id, BaseUser user)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null) return null;
            existingUser.Id = id;
            await _dataContext.SaveChangesAsync();
            //    existingUser.CreatedAt = user.CreatedAt;

            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;

            _dataContext.Users.Remove(user);
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}
