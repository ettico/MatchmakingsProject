using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using MatchMakings.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Service
{
   public class UserRoleService: IUserRoleService
    {
        private readonly IUserRoleRepository _userRolesRepository;
        private readonly IRoleRepository _roleRpository;

        public UserRoleService(IUserRoleRepository userRolesRepository, IRoleRepository roleRpository)
        {
            _userRolesRepository = userRolesRepository;
            _roleRpository = roleRpository;

        }
        public async Task<UserRole> AddAsync(string role, int userId)
        {
            int r = await _roleRpository.GetIdByRoleAsync(role);
            if (r < 0)
                return null;
            UserRole u = await _userRolesRepository.AddAsync(new UserRole { RoleId = r, UserId = userId });
            return u;
        }
    }
}
