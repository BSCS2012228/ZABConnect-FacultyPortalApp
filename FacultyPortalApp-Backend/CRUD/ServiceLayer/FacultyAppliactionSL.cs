using FACULTY.CommonLayer.Models;
using FACULTY.RepositoryLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.ServiceLayer
{
    public class FacultyAppliactionSL : IFacultyAppliactionSL
    {
        public readonly IFacultyAppliactionRL _facultyAppliactionRL;
        public FacultyAppliactionSL(IFacultyAppliactionRL facultyAppliactionRL)
        {
            _facultyAppliactionRL = facultyAppliactionRL;
        }      

        public async Task<LoginResponse> Login(LoginRequest request)
        {

            return await _facultyAppliactionRL.Login(request);

        }

        public async Task<ChangePasswordResponse> ChangePassword(ChangePasswordRequest request)
        {
            
            return await _facultyAppliactionRL.ChangePassword(request);
        }

        public async Task<LectureProgressResponse> LectureProgress(LectureProgressRequest request)
        {

            return await _facultyAppliactionRL.LectureProgress(request);
        }

        public async Task<LectureAttendanceResponse> LectureAttendance(LectureAttendanceRequest request)
        {

            return await _facultyAppliactionRL.LectureAttendance(request);
        }

        public async Task<CourseInformationResponse> CourseInformation(CourseInformationRequest request)
        {

            return await _facultyAppliactionRL.CourseInformation(request);
        }

        public async Task<FacLectureProgressInsertResponse> FacLectureProgressInsert(FacLectureProgressInsertRequest request)
        {

            return await _facultyAppliactionRL.FacLectureProgressInsert(request);
        }

        public async Task<UnmarkedLectureNumbersResponse> UnmarkedLectureNumbers(UnmarkedLectureNumbersRequest request)
        {

            return await _facultyAppliactionRL.UnmarkedLectureNumbers(request);
        }

        public async Task<StudentListResponse> StudentList(StudentListRequest request)
        {

            return await _facultyAppliactionRL.StudentList(request);
        }

        public async Task<LectureAttendanceSummaryResponse> LectureAttendanceSummary(LectureAttendanceSummaryRequest request)
        {

            return await _facultyAppliactionRL.LectureAttendanceSummary(request);
        }

        public async Task<UserProfileResponse> UserProfile(UserProfileRequest request)
        {

            return await _facultyAppliactionRL.UserProfile(request);
        }
        public async Task<InsertCourseLectureAttendanceResponse> InsertCourseLectureAttendance(InsertCourseLectureAttendanceRequest request)
        {

            return await _facultyAppliactionRL.InsertCourseLectureAttendance(request);
        }

        public async Task<FacCourseOutlineShowResponse> FacCourseOutlineShow(FacCourseOutlineShowRequest request)
        {

            return await _facultyAppliactionRL.FacCourseOutlineShow(request);
        }

        public async Task<CourseRecapSheetDataResponse> CourseRecapSheetData(CourseRecapSheetDataRequest request)
        {

            return await _facultyAppliactionRL.CourseRecapSheetData(request);
        }

        public async Task<CourseOutlineMarksDistributionResponse> CourseOutlineMarksDistribution(CourseOutlineMarksDistributionRequest request)
        {

            return await _facultyAppliactionRL.CourseOutlineMarksDistribution(request);
        }

        public async Task<FacStdRecapSheetShowRecapResponse> FacStdRecapSheetShowRecap(FacStdRecapSheetShowRecapRequest request)
        {

            return await _facultyAppliactionRL.FacStdRecapSheetShowRecap(request);
        }

        public async Task<FacStdRecapSheetInsertResponse> FacStdRecapSheetInsert(FacStdRecapSheetInsertRequest request)
        {

            return await _facultyAppliactionRL.FacStdRecapSheetInsert(request);
        }
        public async Task<ForgotPasswordResponse> ForgotPassword(ForgotPasswordRequest request)
        {

            return await _facultyAppliactionRL.ForgotPassword(request);
        }

        public async Task<ConversationResponse> Conversation(ConversationRequest request)
        {
            return await _facultyAppliactionRL.Conversation(request);
        }

        public async Task<ViewMessagesResponse> ViewMessages(ViewMessagesRequest request)
        {
            return await _facultyAppliactionRL.ViewMessages(request);
        }

        public async Task<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            return await _facultyAppliactionRL.SendMessage(request);
        }

        public async Task<GetUserProfileResponse> GetUserProfile(GetUserProfileRequest request)
        {
            return await _facultyAppliactionRL.GetUserProfile(request);
        }

        public async Task<PortfolioFileResponse> PortfolioFile(PortfolioFileRequest request)
        {
            return await _facultyAppliactionRL.PortfolioFile(request);
        }
        public async Task<RecapSheetRecordResponse> RecapSheetRecord(RecapSheetRecordRequest request)
        {
            return await _facultyAppliactionRL.RecapSheetRecord(request);
        }

        public async Task<FacGuidelineResponse> FacGuideline(FacGuidelineRequest request)
        {
            return await _facultyAppliactionRL.FacGuideline(request);
        }

        public async Task<OfferedCoursesResponse> OfferedCourse(OfferedCoursesRequest request)
        {
            return await _facultyAppliactionRL.OfferedCourse(request);
        }

        public async Task<InsertFacCourseOutlineResponse> InsertFacCourseOutline(InsertFacCourseOutlineRequest request)
        {
            return await _facultyAppliactionRL.InsertFacCourseOutline(request);
        }

        public async Task<InsertCoursePortfolioResponse> InsertCoursePortfolio(InsertCoursePortfolioRequest request)
        {
            return await _facultyAppliactionRL.InsertCoursePortfolio(request);
        }

        public async Task<GetTotalLectureCountResponse> GetTotalLectureCount(GetTotalLectureCountRequest request)
        {
            return await _facultyAppliactionRL.GetTotalLectureCount(request);
        }

        public async Task<GetClassSchedularResponse> GetClassSchedular(GetClassSchedularRequest request)
        {
            return await _facultyAppliactionRL.GetClassSchedular(request);
        }

        public async Task<GetDailyClassScheduleDetailsResponse> GetDailyClassScheduleDetails(GetDailyClassScheduleDetailsRequest request)
        {
            return await _facultyAppliactionRL.GetDailyClassScheduleDetails(request);
        }
        public async Task<InsertPDFResponse> InsertPDF(InsertPDFRequest request)
        {
            return await _facultyAppliactionRL.InsertPDF(request);
        }
        public async Task<ViewPDFResponse> ViewPDF(ViewPDFRequest request)
        {
            return await _facultyAppliactionRL.ViewPDF(request);
        }

    }


}
