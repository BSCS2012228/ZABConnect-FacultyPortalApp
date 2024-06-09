using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    public class ForgotPasswordRequest
    {
        public string UserId { get; set; }
    }

    public class ForgotPasswordResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string VerificationCode { get; set; }
    }


}
