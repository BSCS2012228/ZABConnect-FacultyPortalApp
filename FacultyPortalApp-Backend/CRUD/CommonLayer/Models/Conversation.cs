using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    // Request class for Conversation API
    public class ConversationRequest
    {
        public string UserId { get; set; }
    }

    // Response class for Conversation API
    public class ConversationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<Conversation> Conversations { get; set; }
    }

    // Class representing a conversation
    public class Conversation
    {
        public int ConversationID { get; set; }
        public string OtherUserID { get; set; }
        public string OtherUserFirstName { get; set; } // Other user's first name
        public string OtherUserLastName { get; set; } // Other user's last name
        public string OtherUserEmail { get; set; } // Other user's email
        public string OtherUserNumber { get; set; } // Other user's phone number
        public string OtherUserCNIC { get; set; } // Other user's CNIC
                                                  // Add more properties as needed
    }



}
