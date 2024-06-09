using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class InsertFacCourseOutlineRequest
    {
        public string CreatedBy { get; set; }
        public int ProcessId { get; set; }
        public byte CampusId { get; set; }
        public int RequestTypeId { get; set; }
        public int OfferedCourseId { get; set; }
        public int SemesterId { get; set; }
        public byte SemesterSectionId { get; set; }
        public string Summary { get; set; }
        public bool Posted { get; set; }
        public string CourseLectureOutline { get; set; }
        public string ClassTiming { get; set; }
        public string Session { get; set; }
        public string ConsultationTime { get; set; }
        public string EmailAddress { get; set; }
        public string ContactNo { get; set; }
        public string LearningOutcomes { get; set; }
        public string LearningStrategies { get; set; }
        public string ClassHour { get; set; }
        public string LabHour { get; set; }
        public string CourseDescription { get; set; }
        public string CourseObjectives { get; set; }
        public string ClassStartTime { get; set; }
        public string ClassEndTime { get; set; }
        // Add other properties as per your stored procedure parameters
    }

    public class InsertFacCourseOutlineResponse
    {
        public int ReturnValue { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
