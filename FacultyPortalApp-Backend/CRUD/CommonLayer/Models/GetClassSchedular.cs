using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class GetClassSchedularResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<ClassSchedular> ClassSchedulars { get; set; }
    }

    public class GetClassSchedularRequest
    {
        // No properties needed as the stored procedure does not require any parameters
    }

    public class ClassSchedular
    {
        public int ClassId { get; set; }
        public string ClassScheduleTitle { get; set; }
        public string ClassSubTitle { get; set; }
        public string ClassSchedularPath { get; set; }
        
    }

}
