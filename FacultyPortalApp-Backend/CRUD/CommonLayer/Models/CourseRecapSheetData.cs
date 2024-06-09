using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class CourseRecapSheetDataRequest
    {
        public string UserId { get; set; }
        public int CourseId { get; set; }
        public int SemesterId { get; set; }
        public byte SectionId { get; set; }
    }

    public class CourseRecapSheetDataResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<MarkHeadData> MarkHeads { get; set; }
    }

    public class MarkHeadData
    {
        public byte MarkHeadId { get; set; }

        public String MarkHeadName { get; set; }
        public List<StudentMarks> Students { get; set; }
    }

    public class StudentMarks
    {
        public string RegNo { get; set; }
        public string StudentName { get; set; }
        // Add other properties for student marks as needed
    }





}
