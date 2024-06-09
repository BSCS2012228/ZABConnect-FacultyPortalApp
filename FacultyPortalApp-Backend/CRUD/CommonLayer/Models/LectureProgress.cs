using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class LectureProgressRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class LectureProgressResponse
    {
        public bool IsSuccess { get; set; }
        public string CourseDesc { get; set; }
        public string ProgramShortDesc { get; set; }
        public string SemesterSectionName { get; set; }
        public List<LectureDetail> LectureDetails { get; set; }
        public string Message { get; set; }
        public int TotalLectureCount { get; set; }

    }

    public class LectureDetail
    {
        public int LectureNo { get; set; }
        public string LectureDate { get; set; }
        public string ClassStartTime { get; set; }
        public string ClassEndTime { get; set; }
        public string ClassStatus { get; set; }
        public string TopicsCovered { get; set; }
        public string ClassActivity { get; set; }
        public bool IsAttendanceMarked { get; set; }
        public string ClassTime { get; set; }
    }

    public class ClassStatus
    {
        public int ClassStatusId { get; set; }
        public string ShortDesc { get; set; }
        public string LongDesc { get; set; }
    }
}
