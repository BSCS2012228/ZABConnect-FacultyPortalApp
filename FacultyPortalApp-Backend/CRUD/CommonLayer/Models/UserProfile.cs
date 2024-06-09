using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class UserProfileRequest
    {
        public string UserId { get; set; }
    }

    public class UserProfileResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Number { get; set; }
        public string CNIC { get; set; }
    }
}
