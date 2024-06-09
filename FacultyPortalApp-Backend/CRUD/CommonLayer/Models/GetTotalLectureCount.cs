using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class GetTotalLectureCountRequest
    {
        public string UserId { get; set; }
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public int CourseId { get; set; }
    }

    public class GetTotalLectureCountResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int TotalLectureCount { get; set; }
    }
}
