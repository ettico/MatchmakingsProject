using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.IRepositories
{
   public interface IUserRoleRepository
    {
        Task<UserRole> AddAsync(UserRole userRole);
        Task DeleteAsync(int id);
        Task<IEnumerable<UserRole>> GetAllAsync(); // שונה מ-IEnumerable ל-Task<IEnumerable>
        Task<UserRole> GetByUserIdAsync(int id); // שונה מ-UserRoles ל-Task<UserRoles>
                                                 //  Task<UserRole> GetByIdAsync(int id); // שונה מ-UserRoles ל-Task<UserRoles>
        Task<bool> UpdateAsync(int id, UserRole userRole);
    }
}
