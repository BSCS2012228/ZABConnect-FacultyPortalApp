using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class UnmarkedLectureNumbersRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }


    public class UnmarkedLectureNumbersResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<int> UnmarkedLectureNumbers { get; set; }
    }
}
