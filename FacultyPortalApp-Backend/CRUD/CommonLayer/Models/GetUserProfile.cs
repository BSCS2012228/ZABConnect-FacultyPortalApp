using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
    // Request class
    public class GetUserProfileRequest
    {
        public string SearchInput { get; set; }
    }

    // Response class
    public class GetUserProfileResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<UserProfile> UserProfiles { get; set; }
    }

    // User Profile class
    public class UserProfile
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
    }

}

