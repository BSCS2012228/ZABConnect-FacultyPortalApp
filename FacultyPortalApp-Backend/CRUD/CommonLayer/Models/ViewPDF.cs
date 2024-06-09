using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class ViewPDFRequest
    {
        public string sUser_id { get; set; }
        public int? CourseID { get; set; }
        public int? SemesterID { get; set; }
        public int? SemesterSectionID { get; set; }
    }

    public class ViewPDFResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<PDFItem> PDFList { get; set; }
    }

    public class PDFItem
    {
        public int PDFID { get; set; }
        public string sUser_id { get; set; }
        public int CourseID { get; set; }
        public int SemesterID { get; set; }
        public int SemesterSectionID { get; set; }
        public string FileDescription { get; set; }
        public string Title { get; set; }
        public string FileLocation { get; set; }
        public DateTime DateCreated { get; set; }
    }


}
