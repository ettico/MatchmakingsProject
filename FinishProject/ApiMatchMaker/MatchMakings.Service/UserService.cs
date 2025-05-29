using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Service
{
    public class UserService : IServiceUser
    {

        private readonly IRepositoryUser _userRepository;

        private readonly IUserRoleRepository _userrolerepository;
        private readonly IRoleRepository _rolerepository;
        private readonly IMapper _mapper;

        public UserService(IRepositoryUser userRepository, IUserRoleRepository userRoleRepository, IRoleRepository roleRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _userrolerepository = userRoleRepository;
            _rolerepository = roleRepository;
            _mapper = mapper;
        }




        public async Task<IEnumerable<BaseUserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BaseUserDTO>>(users);
        }

        public async Task<BaseUserDTO> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<BaseUserDTO>(user);
        }

        public async Task<BaseUserDTO> AddUserAsync(BaseUserDTO userDto)
        {
            var user = _mapper.Map<BaseUser>(userDto);
            var addedUser = await _userRepository.AddUserAsync(user);
            return _mapper.Map<BaseUserDTO>(addedUser);
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            // מחיקה ידנית של התאמות לפני מחיקת המשתמש
            // var matches = await _matchMakingRepository.GetListOfMatchMakingAsync();
            //var userMatches = matches.Where(m => m.CandidateId == userId || m.WomenId == userId).ToList();

            //foreach (var match in userMatches)
            //{
            //    await _matchMakingRepository.DeleteMatchMakingAsync(match.Id);
            //}

            // מחיקת המשתמש אחרי שההתאמות נמחקו
            var user = await _userRepository.GetByIdAsync(userId);
            if (user != null)
            {
                await _userRepository.DeleteUserAsync(userId);
                return true;
            }

            return false;
        }



        public async Task<BaseUserDTO> UpdateUserAsync(int id, BaseUserDTO userDto)
        {
            var user = _mapper.Map<BaseUser>(userDto);
            var updatedUser = await _userRepository.UpdateUserAsync(id, user);
            return _mapper.Map<BaseUserDTO>(updatedUser);
        }





        //public async Task<UserDTOs> AddUserAsync(UserDTOs user)
        //{
        //    int id = await _rolerepository.GetIdByRoleAsync("User");
        //    var addeUser = _mapper.Map<User>(user);
        //    //    addeUser.CreatedAt = DateTime.Now;
        //    var createUser = await _userRepository.AddUserAsync(addeUser);

        //    await _repositoryManager.saveAsync();
        //    var r = await _userrolerepository.AddAsync(new UserRole() { RoleId = id, UserUserId = createUser.Id });
        //    Console.WriteLine(r);
        //    await _repositoryManager.saveAsync();
        //    return _mapper.Map<UserDTOs>(createUser);
        //}


        //public async Task<UserDTOs> UpdateUserAsync(int id, UserDTOs user)
        //{
        //    if (id < 0 || user == null)
        //        return null;
        //    var updateUser = _mapper.Map<User>(user);
        //    var result = await _repositoryManager.UserUser.UpdateUserAsync(id, updateUser);
        //    Console.WriteLine("נקודת עצירה");
        //    await _repositoryManager.saveAsync();

        //    return _mapper.Map<UserDTOs>(result);
        //}

        //public async Task<bool> DeleteUserAsync(int id)
        //{
        //    var deletedMatchMaker = await _repositoryManager.UserUser.DeleteUserAsync(id);
        //    if (deletedMatchMaker != null)
        //    {
        //        await _repositoryManager.saveAsync();
        //        return true;
        //    }
        //    return false;
        //}
        public async Task<BaseUserDTO> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByUserByEmailAsync(email);
            return _mapper.Map<BaseUserDTO>(user);
        }
        public async Task<string> AuthenticateAsync(string email, string password)
        {
            BaseUser user = await _userRepository.GetByUserByEmailAsync(email);
            if (user == null || !user.Password.Equals(password))
            {
                return null;
            }

            var userRole = await _userrolerepository.GetByUserIdAsync(user.Id);
            if (userRole == null)
                return null;

            return userRole.Role.RoleName;
        }


        //public async Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync()
        //{
        //    var users = await _userRepository.GetAllAsync();
        //    var monthlyRegistrations = users
        //        .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
        //        .Select(g => new MonthlyRegistrationsDto
        //        {
        //            Year = g.Key.Year,
        //            Month = g.Key.Month,
        //            Count = g.Count()
        //        }).ToList();

        //    return monthlyRegistrations;
        //}

        public async Task<BaseUserDTO> RegisterOrUpdateUserAsync(BaseUserDTO userDto)
        {
            var existingUser = await _userRepository.GetByUserByEmailAsync(userDto.Username);

            if (existingUser == null)
            {
                var newUser = _mapper.Map<BaseUser>(userDto);
                //newUser. = DateTime.Now;
                var addedUser = await _userRepository.AddUserAsync(newUser);

                // שייכות לתפקיד אם צריך
                int roleId = await _rolerepository.GetIdByRoleAsync("User");
                await _userrolerepository.AddAsync(new UserRole { UserId = addedUser.Id, RoleId = roleId });

                return _mapper.Map<BaseUserDTO>(addedUser);
            }
            else
            {
                // אם רוצים לעדכן פרטים קיימים כמו שם, עושים את זה פה
                existingUser.Username = userDto.Username;
                var updatedUser = await _userRepository.UpdateUserAsync(existingUser.Id, existingUser);
                return _mapper.Map<BaseUserDTO>(updatedUser);
            }
        }


    }
}
