using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class FacStdRecapSheetInsertRequest
    {
        public string UserId { get; set; }
        public List<MarksofStudent> Students { get; set; }
        public decimal OfferedCoursesCourseId { get; set; }
        public byte MarksHeadId { get; set; }
        public decimal SemesterId { get; set; }
        public decimal SemesterSectionId { get; set; }
        public short MarksTypeSerialNo { get; set; }
        public float TotalMarks { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public char ShowResult { get; set; }
    }

    public class MarksofStudent
    {
        public decimal StdMainId { get; set; }
        public float MarksObtained { get; set; }
    }

    public class FacStdRecapSheetInsertResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
