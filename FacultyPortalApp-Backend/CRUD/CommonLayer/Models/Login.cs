using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class LoginRequest
    {
        public string UserId { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public bool IsSuccess { get; set; }

        public string Message { get; set; }

        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public List<Dictionary<string, string>> RolDegProCou { get; set; }
    }
}
