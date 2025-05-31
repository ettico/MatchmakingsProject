using System.ComponentModel.DataAnnotations;

namespace ApiMatchMaker.PostModels
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]

        public string UserName { get; set; }

        [Required]
        //[StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }
}
