using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class FacCourseOutlineShowRequest
    {
        public string UserId { get; set; }
        public decimal SemesterId { get; set; }
        public byte SemesterSectionId { get; set; }
        public decimal CourseId { get; set; }
    }

    public class FacCourseOutlineShowResponse
    {
        public string CourseLongDesc { get; set; }
        public string ProgramShortDesc { get; set; }
        public string SemesterSectionName { get; set; }
        public string SemesterNo { get; set; }
        public int ReturnValue { get; set; }
        public string PreRequisite { get; set; }
        public string FacultyFullName { get; set; }
        public DateTime PostedDate { get; set; }
        public string Summary { get; set; }
        public bool IsPosted { get; set; }
        public string ClassTiming { get; set; }
        public string Session { get; set; }
        public string ConsultationTime { get; set; }
        public string EmailAddress { get; set; }
        public string ContactNo { get; set; }
        public string LearningOutcomes { get; set; }
        public string LearningStrategies { get; set; }
        public string ClassStartTime { get; set; }
        public string ClassEndTime { get; set; }
        public string TeachingLearningMethod { get; set; }
        public string Materials { get; set; }
        public string ClassConduct { get; set; }
        public string CourseDescription { get; set; }
        public string CourseObjectives { get; set; }
        public List<FacCourseOutlineLecture> Lectures { get; set; }
        public string Message { get; set; }

        public bool IsSuccess { get; set; }
    }

    public class FacCourseOutlineLecture
    {
        public byte LectureNo { get; set; }
        public string LectureDetail { get; set; }
    }
}
