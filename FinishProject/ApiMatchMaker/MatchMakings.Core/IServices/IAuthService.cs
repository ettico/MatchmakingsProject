using MatchMakings.Core.DTOs;
using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.IServices
{
   public interface IAuthService
   {
        //public string GenerateToken(string username, string[] roles);
        public string GenerateToken( BaseUserDTO user);

        Task<BaseUser> AuthenticateUser(LoginDTO loginDto);
        Task<BaseUser> RegisterUser(RegisterDTO registerDto);
        Task<BaseUser> GetUserById(int id);
        Task DeleteUser(int id);
        public Task<IEnumerable<Male>> GetListOfMaleAsync();
        //object GenerateToken(BaseUserDTO user);
    }
}
