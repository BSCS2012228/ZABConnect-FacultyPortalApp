using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class LectureAttendanceSummaryRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class LectureAttendanceSummaryResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int TotalStudentsInCourse { get; set; }
        public Dictionary<int, int> LectureAttendanceCounts { get; set; }
    }
}
