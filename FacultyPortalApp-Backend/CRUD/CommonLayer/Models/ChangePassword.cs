using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.CommonLayer.Models
{
	public class ChangePasswordRequest
	{
		public string UserId { get; set; }
		public string NewPassword { get; set; }
	}
	public class ChangePasswordResponse
	{
		public bool IsSuccess { get; set; }

		public string Message { get; set; }
	}
}

