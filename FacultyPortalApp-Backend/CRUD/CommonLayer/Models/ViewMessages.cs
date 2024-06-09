using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{

    // Request class for ViewMessages API
    public class ViewMessagesRequest
    {
        public int ConversationID { get; set; }
    }

    // Response class for ViewMessages API
    public class ViewMessagesResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<Message> Messages { get; set; }
    }

    // Class representing a message
    public class Message
    {
        public int MessageID { get; set; }
        public string SenderID { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        // Add more properties as needed
    }




}
