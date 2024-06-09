using FACULTY.CommonLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FACULTY.RepositoryLayer
{
    public interface IFacultyAppliactionRL
    {
        Task<LoginResponse> Login(LoginRequest request);
        Task<ChangePasswordResponse> ChangePassword(ChangePasswordRequest request);

        Task<LectureProgressResponse> LectureProgress(LectureProgressRequest request);

        Task<LectureAttendanceResponse> LectureAttendance(LectureAttendanceRequest request);

        Task<CourseInformationResponse> CourseInformation(CourseInformationRequest request);

        Task<FacLectureProgressInsertResponse> FacLectureProgressInsert(FacLectureProgressInsertRequest request);

        Task<UnmarkedLectureNumbersResponse> UnmarkedLectureNumbers(UnmarkedLectureNumbersRequest request);

        Task<StudentListResponse> StudentList(StudentListRequest request);

        Task<LectureAttendanceSummaryResponse> LectureAttendanceSummary(LectureAttendanceSummaryRequest request);
        Task<UserProfileResponse> UserProfile(UserProfileRequest request);
        Task<InsertCourseLectureAttendanceResponse> InsertCourseLectureAttendance(InsertCourseLectureAttendanceRequest request);

        Task<FacCourseOutlineShowResponse> FacCourseOutlineShow(FacCourseOutlineShowRequest request);

        Task<CourseRecapSheetDataResponse> CourseRecapSheetData(CourseRecapSheetDataRequest request);

        Task<CourseOutlineMarksDistributionResponse> CourseOutlineMarksDistribution(CourseOutlineMarksDistributionRequest request);
        Task<FacStdRecapSheetShowRecapResponse> FacStdRecapSheetShowRecap(FacStdRecapSheetShowRecapRequest request);

        Task<FacStdRecapSheetInsertResponse> FacStdRecapSheetInsert(FacStdRecapSheetInsertRequest request);

        Task<ForgotPasswordResponse> ForgotPassword(ForgotPasswordRequest request);

        Task<ConversationResponse> Conversation(ConversationRequest request);

        Task<ViewMessagesResponse> ViewMessages(ViewMessagesRequest request);

        Task<SendMessageResponse> SendMessage(SendMessageRequest request);

        Task<GetUserProfileResponse> GetUserProfile(GetUserProfileRequest request);

        Task<PortfolioFileResponse> PortfolioFile(PortfolioFileRequest request);

        Task<RecapSheetRecordResponse> RecapSheetRecord(RecapSheetRecordRequest request);

        Task<FacGuidelineResponse> FacGuideline(FacGuidelineRequest request);

        Task<OfferedCoursesResponse> OfferedCourse(OfferedCoursesRequest request);

        Task<InsertFacCourseOutlineResponse> InsertFacCourseOutline(InsertFacCourseOutlineRequest request);

        Task<InsertCoursePortfolioResponse> InsertCoursePortfolio(InsertCoursePortfolioRequest request);

        Task<GetTotalLectureCountResponse> GetTotalLectureCount(GetTotalLectureCountRequest request);


        Task<GetClassSchedularResponse> GetClassSchedular(GetClassSchedularRequest request);

        Task<GetDailyClassScheduleDetailsResponse> GetDailyClassScheduleDetails(GetDailyClassScheduleDetailsRequest request);

        Task<InsertPDFResponse> InsertPDF(InsertPDFRequest request);

        Task<ViewPDFResponse> ViewPDF(ViewPDFRequest request);

    }
}
