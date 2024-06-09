using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class FacLectureProgressInsertRequest
    {
        public string CreatedBy { get; set; }
        public int ProcessId { get; set; }
        public byte CampusId { get; set; }
        public int OfferedCoursesCourseId { get; set; }
        public string UserId { get; set; }
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public short LectureNo { get; set; }
        public DateTime LectureDate { get; set; }
        public DateTime ClassStartTime { get; set; }
        public DateTime ClassEndTime { get; set; }
        public char ClassStatus { get; set; }
        public string TopicsCovered { get; set; }
        public bool IsAttendanceMark { get; set; }
        public string ClassActivity { get; set; }
    }


    public class FacLectureProgressInsertResponse
    {
      
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
