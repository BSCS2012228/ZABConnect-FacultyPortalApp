using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class FacGuideline
    {
        public int HeadId { get; set; }
        public string HeadShortDesc { get; set; }
        public string HeadLongDesc { get; set; }
        public int DetailId { get; set; }
        public string DetailDesc { get; set; }
        public string PostedBy { get; set; }
        public bool IsLocked { get; set; }
    }

    public class FacGuidelineResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<FacGuideline> FacGuidelines { get; set; }
        public int ReturnValue { get; set; }
    }

    public class FacGuidelineRequest
    {
        public int CampusId { get; set; }
    }
}
