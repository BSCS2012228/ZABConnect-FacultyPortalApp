using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    // Request class for SendMessage API
    public class SendMessageRequest
    {
        public string SenderID { get; set; }
        public string RecipientID { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }

    // Response class for SendMessage API
    public class SendMessageResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int MessageID { get; set; } // Optional: If you want to return the newly created message ID
    }




}
