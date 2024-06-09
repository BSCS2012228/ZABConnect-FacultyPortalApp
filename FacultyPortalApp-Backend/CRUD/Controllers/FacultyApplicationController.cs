using FACULTY.CommonLayer.Models;
using FACULTY.ServiceLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyApplicationController : ControllerBase
    {
        public readonly IFacultyAppliactionSL _facultyApplicationSL;

        public FacultyApplicationController(IFacultyAppliactionSL facultyAppliactionSL)
        {
            _facultyApplicationSL = facultyAppliactionSL;
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            LoginResponse response = null;
            try
            {

                response = await _facultyApplicationSL.Login(request);

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            ChangePasswordResponse response = null;
            try
            {

                response = await _facultyApplicationSL.ChangePassword(request);

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("LectureProgressShow")]
        public async Task<IActionResult> LectureProgress(LectureProgressRequest request)
        {
            LectureProgressResponse response = null;
            try
            {

                response = await _facultyApplicationSL.LectureProgress(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetCourseLectureAttendance")]
        public async Task<IActionResult> LectureAttendance(LectureAttendanceRequest request)
        {
            LectureAttendanceResponse response = null;
            try
            {

                response = await _facultyApplicationSL.LectureAttendance(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetCourseInformation")]
        public async Task<IActionResult> CourseInformation(CourseInformationRequest request)
        {
            CourseInformationResponse response = null;
            try
            {

                response = await _facultyApplicationSL.CourseInformation(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("FacLectureProgressInsert")]
        public async Task<IActionResult> FacLectureProgressInsert(FacLectureProgressInsertRequest request)
        {
            FacLectureProgressInsertResponse response = null;
            try
            {

                response = await _facultyApplicationSL.FacLectureProgressInsert(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetUnmarkedLectureNumbers")]
        public async Task<IActionResult> UnmarkedLectureNumbers(UnmarkedLectureNumbersRequest request)
        {
            UnmarkedLectureNumbersResponse response = null;
            try
            {

                response = await _facultyApplicationSL.UnmarkedLectureNumbers(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetStudentList")]
        public async Task<IActionResult> StudentList(StudentListRequest request)
        {
            StudentListResponse response = null;
            try
            {

                response = await _facultyApplicationSL.StudentList(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetLectureAttendanceSummary")]
        public async Task<IActionResult> LectureAttendanceSummary(LectureAttendanceSummaryRequest request)
        {
            LectureAttendanceSummaryResponse response = null;
            try
            {

                response = await _facultyApplicationSL.LectureAttendanceSummary(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetUserProfile")]
        public async Task<IActionResult> UserProfile(UserProfileRequest request)
        {
            UserProfileResponse response = null;
            try
            {

                response = await _facultyApplicationSL.UserProfile(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("InsertLectureAttendance")]
        public async Task<IActionResult> InsertCourseLectureAttendance(InsertCourseLectureAttendanceRequest request)
        {
            InsertCourseLectureAttendanceResponse response = null;
            try
            {

                response = await _facultyApplicationSL.InsertCourseLectureAttendance(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }


        [HttpPost]
        [Route("GetCourseRecapSheetData")]
        public async Task<IActionResult> CourseRecapSheetData(CourseRecapSheetDataRequest request)
        {
            CourseRecapSheetDataResponse response = null;
            try
            {

                response = await _facultyApplicationSL.CourseRecapSheetData(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetCourseOutlineMarksDistribution")]
        public async Task<IActionResult> CourseOutlineMarksDistribution(CourseOutlineMarksDistributionRequest request)
        {
            CourseOutlineMarksDistributionResponse response = null;
            try
            {

                response = await _facultyApplicationSL.CourseOutlineMarksDistribution(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetFacStdRecapSheetShowRecap")]
        public async Task<IActionResult> FacStdRecapSheetShowRecap(FacStdRecapSheetShowRecapRequest request)
        {
            FacStdRecapSheetShowRecapResponse response = null;
            try
            {

                response = await _facultyApplicationSL.FacStdRecapSheetShowRecap(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("FacStdRecapSheetInsert")]
        public async Task<IActionResult> FacStdRecapSheetInsert(FacStdRecapSheetInsertRequest request)
        {
            FacStdRecapSheetInsertResponse response = null;
            try
            {

                response = await _facultyApplicationSL.FacStdRecapSheetInsert(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("ForgotPass")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            ForgotPasswordResponse response = null;
            try
            {

                response = await _facultyApplicationSL.ForgotPassword(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetConversation")]
        public async Task<IActionResult> Conversation(ConversationRequest request)        {
            ConversationResponse response = null;
            try
            {

                response = await _facultyApplicationSL.Conversation(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("ViewMessages")]
        public async Task<IActionResult> ViewMessages(ViewMessagesRequest request)
        {
            ViewMessagesResponse response = null;
            try
            {

                response = await _facultyApplicationSL.ViewMessages(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("SendMessage")]
        public async Task<IActionResult> SendMessage(SendMessageRequest request)
        {
            SendMessageResponse response = null;
            try
            {

                response = await _facultyApplicationSL.SendMessage(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetUserProfileforMessage")]
        public async Task<IActionResult> GetUserProfile(GetUserProfileRequest request)
        {
            GetUserProfileResponse response = null;
            try
            {

                response = await _facultyApplicationSL.GetUserProfile(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetPortfolioFiles")]
        public async Task<IActionResult> PortfolioFile(PortfolioFileRequest request)
        {
            PortfolioFileResponse response = null;
            try
            {

                response = await _facultyApplicationSL.PortfolioFile(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetRecapsheetRecord")]
        public async Task<IActionResult> RecapSheetRecord(RecapSheetRecordRequest request)
        {
            RecapSheetRecordResponse response = null;
            try
            {

                response = await _facultyApplicationSL.RecapSheetRecord(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("FacCourseOutlineShow")]
        public async Task<IActionResult> FacCourseOutlineShow(FacCourseOutlineShowRequest request)
        {
            FacCourseOutlineShowResponse response = null;
            try
            {

                response = await _facultyApplicationSL.FacCourseOutlineShow(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("FacGuidelineShow")]
        public async Task<IActionResult> FacGuideline(FacGuidelineRequest request)
        {
            FacGuidelineResponse response = null;
            try
            {

                response = await _facultyApplicationSL.FacGuideline(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("ViewOfferedCourses")]
        public async Task<IActionResult> OfferedCourse(OfferedCoursesRequest request)
        {
            OfferedCoursesResponse response = null;
            try
            {

                response = await _facultyApplicationSL.OfferedCourse(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("InsertFacCourseOutline")]
        public async Task<IActionResult> InsertFacCourseOutline(InsertFacCourseOutlineRequest request)
        {
            InsertFacCourseOutlineResponse response = null;
            try
            {

                response = await _facultyApplicationSL.InsertFacCourseOutline(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("InsertCoursePortfolio")]
        public async Task<IActionResult> InsertCoursePortfolio(InsertCoursePortfolioRequest request)
        {
            InsertCoursePortfolioResponse response = null;
            try
            {

                response = await _facultyApplicationSL.InsertCoursePortfolio(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetTotalLectureCount")]
        public async Task<IActionResult> GetTotalLectureCount(GetTotalLectureCountRequest request)
        {
            GetTotalLectureCountResponse response = null;
            try
            {

                response = await _facultyApplicationSL.GetTotalLectureCount(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }


        [HttpGet("Download")]
        public IActionResult DownloadFile(string fileName)
        {
            try
            {
                string filePath = Path.Combine("C:\\Users\\Backend\\Files\\PortfolioFiles", fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found.");
                }

                // Return the file as a stream
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                return File(fileStream, "application/octet-stream", fileName);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error downloading file: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost]
        [Route("GetClassSchedule")]
        public async Task<IActionResult> GetClassSchedular(GetClassSchedularRequest request)
        {
            GetClassSchedularResponse response = null;
            try
            {

                response = await _facultyApplicationSL.GetClassSchedular(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("GetDailyClassSchedule")]
        public async Task<IActionResult> GetDailyClassScheduleDetails(GetDailyClassScheduleDetailsRequest request)
        {
            GetDailyClassScheduleDetailsResponse response = null;
            try
            {

                response = await _facultyApplicationSL.GetDailyClassScheduleDetails(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost("UploadPortfolioFile")]
        public async Task<IActionResult> UploadPortfolioFileAsync([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { isSuccess = false, message = "No file uploaded." });
            }

            try
            {
                var filePath = Path.Combine("C:\\Users\\Backend\\Files\\PortfolioFiles", file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { isSuccess = true, message = "File uploaded successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { isSuccess = false, message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("ViewUploadedPDF")]
        public async Task<IActionResult> ViewPDF(ViewPDFRequest request)
        {
            ViewPDFResponse response = null;
            try
            {

                response = await _facultyApplicationSL.ViewPDF(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("InsertPDF")]
        public async Task<IActionResult> InsertPDF(InsertPDFRequest request)
        {
            InsertPDFResponse response = null;
            try
            {

                response = await _facultyApplicationSL.InsertPDF(request);

            }
            catch (Exception ex)
            {
                response.Message = "Exception Message : " + ex.Message;
            }

            return Ok(response);
        }
    }
}
