using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class InsertCoursePortfolioRequest
    {
        public byte CampusId { get; set; }
        public int OfferedCourseId { get; set; }
        public string UserId { get; set; }
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string WeekNumber { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
    }

    public class InsertCoursePortfolioResponse
    {
        public int ReturnValue { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }




}
