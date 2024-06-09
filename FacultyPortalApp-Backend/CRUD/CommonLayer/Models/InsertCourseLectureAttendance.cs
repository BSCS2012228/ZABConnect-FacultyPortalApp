using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class InsertCourseLectureAttendanceRequest
    {
        public string CreatedBy { get; set; }
        public DateTime CourseLectureAttendanceDate { get; set; }
        public byte CourseLectureAttendanceLectureNo { get; set; }
        public decimal OfferedCoursesCourseId { get; set; }
        public string UserId { get; set; }
        public decimal SemesterId { get; set; }
        public byte SemesterSectionId { get; set; }
        public string LectureAttendance { get; set; }
    }

    public class InsertCourseLectureAttendanceResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

}
