using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    public class GetDailyClassScheduleDetailsRequest
    {
        public short SemesterYear { get; set; }
        public short SemesterType { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
    }


    public class ClassScheduleDetail
    {
        public string ClassType { get; set; }
        public string CourseName { get; set; }
        public string SectionName { get; set; }
        public string FacultyName { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string RoomLabel { get; set; }
        public string BuildingId { get; set; }
        public int SlotNo { get; set; }
        public string ClassStatusId { get; set; }
    }

    public class GetDailyClassScheduleDetailsResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<ClassScheduleDetail> ClassScheduleDetails { get; set; }
    }

}
