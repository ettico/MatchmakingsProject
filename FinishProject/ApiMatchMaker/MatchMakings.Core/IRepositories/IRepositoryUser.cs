using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.IRepositories
{
    public interface IRepositoryUser
    {
        Task<IEnumerable<BaseUser>> GetAllAsync();
        Task<BaseUser> GetByIdAsync(int id);
        Task<BaseUser> AddUserAsync(BaseUser user);
        Task<BaseUser> UpdateUserAsync(int id, BaseUser user);
        Task<bool> DeleteUserAsync(int id);
        Task<BaseUser> GetByUserByEmailAsync(string email);

    }
}
