using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.DTOs
{
        public class MatchResultDto
        {
            public int CandidateId { get; set; }
            public string Name { get; set; }
            public int Score { get; set; }
        }
}
