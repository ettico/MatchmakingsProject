namespace ApiMatchMaker.PostModels
{
    public class BaseUserPostModels
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // "Male", "Women", "MatchMaker"
        public BaseUserPostModels(string FName, string LName, string Username, string Password, string Role)
        {
            this.FirstName = FName;
            this.LastName = LName;
            this.Username = Username;
            this.Password = Password;
            this.Role = Role;
        }
        public BaseUserPostModels()
        {

        }
    }
}
