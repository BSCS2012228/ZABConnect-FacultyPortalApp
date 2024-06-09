using FACULTY.CommonLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.ServiceLayer
{
    public interface IFacultyAppliactionSL
    {
        public Task<LoginResponse> Login(LoginRequest request);
        public Task<ChangePasswordResponse> ChangePassword(ChangePasswordRequest request);
        public Task<LectureProgressResponse> LectureProgress(LectureProgressRequest request);
        public Task<LectureAttendanceResponse> LectureAttendance(LectureAttendanceRequest request);
        public Task<CourseInformationResponse> CourseInformation(CourseInformationRequest request);
        public Task<FacLectureProgressInsertResponse> FacLectureProgressInsert(FacLectureProgressInsertRequest request);
        public Task<UnmarkedLectureNumbersResponse> UnmarkedLectureNumbers(UnmarkedLectureNumbersRequest request);
        public Task<StudentListResponse> StudentList(StudentListRequest request);
        public Task<LectureAttendanceSummaryResponse> LectureAttendanceSummary(LectureAttendanceSummaryRequest request);
        public Task<UserProfileResponse> UserProfile(UserProfileRequest request);
        public Task<InsertCourseLectureAttendanceResponse> InsertCourseLectureAttendance(InsertCourseLectureAttendanceRequest request);
        public Task<FacCourseOutlineShowResponse> FacCourseOutlineShow(FacCourseOutlineShowRequest request);
        public Task<CourseRecapSheetDataResponse> CourseRecapSheetData(CourseRecapSheetDataRequest request);
        public Task<CourseOutlineMarksDistributionResponse> CourseOutlineMarksDistribution(CourseOutlineMarksDistributionRequest request);

        public Task<FacStdRecapSheetShowRecapResponse> FacStdRecapSheetShowRecap(FacStdRecapSheetShowRecapRequest request);
        public Task<FacStdRecapSheetInsertResponse> FacStdRecapSheetInsert(FacStdRecapSheetInsertRequest request);

        public Task<ForgotPasswordResponse> ForgotPassword(ForgotPasswordRequest request);

        public Task<ConversationResponse> Conversation(ConversationRequest request);

        public Task<ViewMessagesResponse> ViewMessages(ViewMessagesRequest request);

        public Task<SendMessageResponse> SendMessage(SendMessageRequest request);

        public Task<GetUserProfileResponse> GetUserProfile(GetUserProfileRequest request);

        public Task<PortfolioFileResponse> PortfolioFile(PortfolioFileRequest request);
        public Task<RecapSheetRecordResponse> RecapSheetRecord(RecapSheetRecordRequest request);

        public Task<FacGuidelineResponse> FacGuideline(FacGuidelineRequest request);

        public Task<OfferedCoursesResponse> OfferedCourse(OfferedCoursesRequest request);

        public Task<InsertFacCourseOutlineResponse> InsertFacCourseOutline(InsertFacCourseOutlineRequest request);

        public Task<InsertCoursePortfolioResponse> InsertCoursePortfolio(InsertCoursePortfolioRequest request);

        public Task<GetTotalLectureCountResponse> GetTotalLectureCount(GetTotalLectureCountRequest request);

        public Task<GetClassSchedularResponse> GetClassSchedular(GetClassSchedularRequest request);

        public Task<GetDailyClassScheduleDetailsResponse> GetDailyClassScheduleDetails(GetDailyClassScheduleDetailsRequest request);

        public Task<ViewPDFResponse> ViewPDF(ViewPDFRequest request);

        public Task<InsertPDFResponse> InsertPDF(InsertPDFRequest request);

    }
    
}