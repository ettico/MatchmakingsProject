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
   public class UserRoleRepository: IUserRoleRepository
    {

        protected readonly DataContext _dataContext;

        public UserRoleRepository(DataContext context)
        {
            _dataContext = context;
        }

        public async Task<UserRole> AddAsync(UserRole userRole)
        {
            await _dataContext.UserRoles.AddAsync(userRole);
            _dataContext.SaveChanges();
            return userRole;
        }

        public async Task DeleteAsync(int id)
        {
            var userRole = await GetByUserIdAsync(id); // שיניתי ל-GetByIdAsync
            if (userRole != null)
            {
                _dataContext.UserRoles.Remove(userRole);
                await _dataContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserRole>> GetAllAsync() // שיניתי ל-Task<IEnumerable>
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role).ToListAsync();
        }

        public async Task<UserRole> GetByUserIdAsync(int id) // שיניתי ל-Task<UserRole>
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == id);
        }

        //public async Task<UserRole> GetByIdAsync(int id) // שיניתי ל-Task<UserRole>
        //{
        //    return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role)
        //        .FirstOrDefaultAsync(ur => ur.Id == id);
        //}

        public async Task<bool> UpdateAsync(int id, UserRole userRole)
        {
            UserRole existingUserRole = await GetByUserIdAsync(id); // שיניתי ל-GetByIdAsync
            if (existingUserRole != null)
            {
                existingUserRole.UserId = userRole.UserId;
                existingUserRole.RoleId = userRole.RoleId;
                await _dataContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
