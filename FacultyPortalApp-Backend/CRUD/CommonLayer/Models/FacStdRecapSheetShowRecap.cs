using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class FacStdRecapSheetShowRecapRequest
    {
        public string UserId { get; set; }
        public int SemesterId { get; set; }
        public byte SemesterSectionId { get; set; }
        public int CourseId { get; set; }
        public short MarksHeadId { get; set; }
        public short SerialNo { get; set; }
    }

    public class FacStdRecapSheetShowRecapResponse
    {
        public int ReturnValue { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<MarksRecapInfo> MarksHeadInfo { get; set; }
        public List<StudentRecapInfo> StudentInfo { get; set; }
    }

    public class MarksRecapInfo
    {
        public string UserId { get; set; }
        
        public byte MarksHeadId { get; set; }
        
        public byte SemesterSectionId { get; set; }
        public short MarksTypeSerialNo { get; set; }
        public double TotalMarks { get; set; }
        
    }

    public class StudentRecapInfo
    {
        public decimal StdMainId { get; set; }
        public string RegistrationNo { get; set; }
        public string Name { get; set; }
        public string MarksObtained { get; set; }
    }


}
