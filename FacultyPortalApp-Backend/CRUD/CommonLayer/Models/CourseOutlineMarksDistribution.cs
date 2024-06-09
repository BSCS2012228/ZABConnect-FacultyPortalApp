using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    
    public class CourseOutlineMarksDistributionRequest
    {
        public string UserId { get; set; }
        public int SemesterId { get; set; }
        public byte SectionId { get; set; }
        public int CourseId { get; set; }
    }

    
    public class CourseOutlineMarksDistributionResponse
    {
        public List<CourseMarksDistributionData> MarksDistribution { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    
    public class CourseMarksDistributionData
    {
        public byte MarksHeadId { get; set; }
        public string MarksHeadDescription { get; set; }
        public byte TotalFrequency { get; set; }
        public byte TotalExempted { get; set; }
        public double TotalMarks { get; set; }
       
    }

}
