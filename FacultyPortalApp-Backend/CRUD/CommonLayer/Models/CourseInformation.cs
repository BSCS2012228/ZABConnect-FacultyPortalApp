using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class CourseInformationRequest
    {
        public string UserId { get; set; }
        public List<Dictionary<string, string>> RolDegProCouList { get; set; }
    }
    public class CourseInformationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<CourseInformationItem> CourseInformationList { get; set; }
    }

    public class CourseInformationItem
    {
        public string CourseName { get; set; }
        public string ProgramName { get; set; }
        public string SemesterSectionName { get; set; }
        public int SemesterID { get; set; }
        public int SemesterSectionID { get; set; }
        public int CourseID { get; set; }
        public string SemesterNo { get; set; }
        



    }

}
