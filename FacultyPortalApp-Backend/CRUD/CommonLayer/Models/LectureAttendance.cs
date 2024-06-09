using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class LectureAttendanceRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class StudentAttendance
    {
        public string RegNo { get; set; }
        public string StudentName { get; set; }
        public string Attendance { get; set; }
    }

    public class LectureAttendanceDetail
    {
        public int LectureNo { get; set; }
        public List<StudentAttendance> StudentAttendances { get; set; }
    }

    public class LectureAttendanceResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<LectureAttendanceDetail> Lectures { get; set; }
    }

}
