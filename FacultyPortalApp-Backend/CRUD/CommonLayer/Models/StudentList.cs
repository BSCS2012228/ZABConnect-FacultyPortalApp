using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    
    public class StudentListRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    
    public class StudentListResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<Student> Students { get; set; }
    }

   
    public class Student
    {
        public string RegNo { get; set; }
        public string StudentName { get; set; }
        public int StdMainId { get; set; } 
    }

}
