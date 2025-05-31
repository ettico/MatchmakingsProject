using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.DTOs
{
    public class ContactDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }

        public int? MaleId { get; set; }
        public int? WomenId { get; set; }
        public int? MatchMakerId { get; set; }
    }
}
