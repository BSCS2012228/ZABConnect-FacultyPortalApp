using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class OfferedCoursesRequest
    {
        public short SemesterYear { get; set; }
        public short SemesterType { get; set; }
    }

    public class CourseInfo
    {
        public string CourseName { get; set; }
        public string FacultyName { get; set; }
        public string SectionName { get; set; }

    }

    public class ProgramInfo
    {
        public string ProgramName { get; set; }
        public List<CourseInfo> Courses { get; set; }
    }

    public class OfferedCoursesResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<ProgramInfo> Programs { get; set; }
    }





}
