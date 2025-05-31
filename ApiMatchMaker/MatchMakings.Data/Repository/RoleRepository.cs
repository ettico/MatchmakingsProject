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
   public class RoleRepository: IRoleRepository
    {

        private readonly DataContext _dataContext;
        public RoleRepository(DataContext context)
        {
            _dataContext = context;
        }

        public async Task<Role> AddAsync(Role role)
        {
            await _dataContext.AddAsync(role);
            role.CreatedAt = DateTime.UtcNow;
            await _dataContext.SaveChangesAsync();

            return role;
        }

        public async Task DeleteAsync(int id)
        {
            var role = await GetRoleByIdAsync(id);
            _dataContext.Roles.Remove(role);
            await _dataContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _dataContext.Roles.ToListAsync();
        }


        public async Task<Role> GetRoleByIdAsync(int id)
        {
            return await _dataContext.Roles.FindAsync(id);
        }



        public async Task<int> GetIdByRoleAsync(string role)
        {
            var r = await _dataContext.Roles.FirstOrDefaultAsync(r => r.RoleName == role);
            if (r != null)
                return r.Id;
            return -1;
        }


        public async Task<bool> UpdateAsync(int id, Role role)
        {
            Role existingRole = await GetRoleByIdAsync(id);
            if (existingRole != null)
            {
                existingRole.RoleName = role.RoleName;
                existingRole.Description = role.Description;
                existingRole.UpdatedAt = DateTime.UtcNow;
                await _dataContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
