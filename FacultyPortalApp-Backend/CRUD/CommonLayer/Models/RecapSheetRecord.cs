using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class RecapSheetRecordRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class RecapSheetRecordResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public Dictionary<int, StudentRecapRecord> RecordsByStudent { get; set; }
        public List<GradingPlan> GradingPlan { get; set; }
    }

    public class StudentRecapRecord
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public string RegistrationNo { get; set; }
        public List<Mark> Marks { get; set; }
    }

    public class Mark
    {
        public byte MarksHeadId { get; set; }
        public short MarksTypeSerialNo { get; set; }
        public float MarksObtained { get; set; }
        public float TotalMarks { get; set; }
    }

    public class GradingPlan
    {
        public int GradingPlanId { get; set; }
        public string Grade { get; set; }
        public float MarksFrom { get; set; }
        public float MarksTo { get; set; }
        public float GPA { get; set; }
    }

}
