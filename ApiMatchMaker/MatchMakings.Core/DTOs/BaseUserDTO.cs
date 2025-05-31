using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.DTOs
{
    public class BaseUserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; }
        public string Role { get; set; } // "Male", "Women", "MatchMaker"
        public BaseUserDTO(string FName, string LName, string Username, string Password, string Role)
        {
            this.FirstName = FName;
            this.LastName = LName;
            this.Username = Username;
            this.Password = Password;
            this.Role = Role;
        }
        public BaseUserDTO()
        {

        }
    }
}
