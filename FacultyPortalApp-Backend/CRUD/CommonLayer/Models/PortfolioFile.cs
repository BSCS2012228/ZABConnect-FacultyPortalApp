using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class PortfolioFile
    {
        public int WeekNumber { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
        public string FileLocation { get; set; }
        public DateTime DateCreated { get; set; }
        public int FacCoursePortfolioId { get; set; }
    }

    public class PortfolioFileRequest
    {
        public int SemesterId { get; set; }
        public int SemesterSectionId { get; set; }
        public string UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class PortfolioFileResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<PortfolioFile> PortfolioFiles { get; set; }
    }
}
