namespace ApiMatchMaker.PostModels
{
    public class ContactPostModels
    {
        public string Name { get; set; }
        public string Phone { get; set; }

        public int? MaleId { get; set; }
        public int? WomenId { get; set; }
        public int? MatchMakerId { get; set; }
    }
}
