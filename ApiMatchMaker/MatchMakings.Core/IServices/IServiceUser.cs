using MatchMakings.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.IServices
{
   public interface IServiceUser
    {

        Task<IEnumerable<BaseUserDTO>> GetAllUsersAsync();
        Task<BaseUserDTO> GetUserByIdAsync(int id);
        Task<BaseUserDTO> AddUserAsync(BaseUserDTO user);
        Task<BaseUserDTO> UpdateUserAsync(int id, BaseUserDTO user);
        Task<bool> DeleteUserAsync(int id);
        Task<BaseUserDTO> GetUserByEmailAsync(string email);
        Task<string> AuthenticateAsync(string email, string password);
        //Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();
        public Task<BaseUserDTO> RegisterOrUpdateUserAsync(BaseUserDTO userDto);
    }
}
