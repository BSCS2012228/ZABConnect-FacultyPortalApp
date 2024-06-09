using FACULTY.CommonLayer.Models;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using System.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using RestSharp;
using RestSharp.Authenticators;

namespace FACULTY.RepositoryLayer
{
    public class FacultyAppliactionRL : IFacultyAppliactionRL
    {
        private readonly IConfiguration _configuration;
        private readonly SqlConnection _sqlConnection;
        private int ConnectionTimeOut = 180;

        public FacultyAppliactionRL(IConfiguration configuration)
        {
            _configuration = configuration;
            string server = "10.0.130.4";
            string userId = "zabsol";
            string password = "abc.321";

            // Update the connection string with the correct server, user id, and password
            string connectionString = $"Data Source={server};Initial Catalog=Zabdesk;User ID={userId};Password={password};";

            _sqlConnection = new SqlConnection(connectionString);
        }


        public async Task<LoginResponse> Login(LoginRequest request)
        {
            LoginResponse response = new LoginResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spVLVerifyUserPassword", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    // Add parameters required by your stored procedure
                    sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psPassword", SqlDbType.VarChar) { Value = request.Password });
                    sqlCommand.Parameters.Add(new SqlParameter("@ptCampus_Id", SqlDbType.TinyInt) { Value = 1 });
                    sqlCommand.Parameters.Add(new SqlParameter("@phSemesterYear", SqlDbType.SmallInt) { Value = 2022 });
                    sqlCommand.Parameters.Add(new SqlParameter("@ptSemesterType_Id", SqlDbType.TinyInt) { Value = 3 });
                    sqlCommand.Parameters.Add(new SqlParameter("@psIPAddress", SqlDbType.VarChar) { Value = "10.0.130.3" });
                    sqlCommand.Parameters.Add(new SqlParameter("@pcClientDestinationType", SqlDbType.Char) { Value = "D" });

                    // Execute the stored procedure
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        // Read the first result set (assuming user information)
                        if (reader.Read())
                        {
                            response.IsSuccess = true;
                            response.Message = "Login Successful";
                            response.UserId = request.UserId;
                            response.FirstName = reader["FirstName"].ToString();
                            response.LastName = reader["LastName"].ToString();
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "Invalid Id Pass";
                        }

                       
                        if (reader.NextResult())
                        {
                            List<Dictionary<string, string>> rolDegProCouList = new List<Dictionary<string, string>>();

                      
                            while (reader.Read())
                            {
                                string rolDegProCouValue = reader["RolDegProCou"].ToString();
                                string[] values = rolDegProCouValue.Split('~');

                          
                                Dictionary<string, string> dictionary = new Dictionary<string, string>
                        {
                            { "Role", values[0] },
                            { "Degree", values[1] },
                            { "Program", values[2] },
                            { "Course", values[3] },
                            { "SemesterID", values[4] },
                            { "SemesterSectionId", values[5] }
                        };

                           
                                rolDegProCouList.Add(dictionary);
                            }

                            response.RolDegProCou = rolDegProCouList;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<ChangePasswordResponse> ChangePassword(ChangePasswordRequest request)
        {
            ChangePasswordResponse response = new ChangePasswordResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spResetFacultyPassword", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                
                    sqlCommand.Parameters.Add(new SqlParameter("@sUserID", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psNewPassword", SqlDbType.VarChar) { Value = request.NewPassword });

                  
                    sqlCommand.ExecuteNonQuery();

                    
                    response.IsSuccess = true;
                    response.Message = "Password changed successfully.";
                }
            }
            catch (SqlException sqlEx)
            {
              
                if (sqlEx.Number == 50000)
                {
        
                    response.IsSuccess = false;
                    response.Message = "Old password does not match.";
                }
                else if (sqlEx.Number == 50001)
                {
                 
                    response.IsSuccess = false;
                    response.Message = "New password and old password do not match.";
                }
                else
                {
              
                    response.IsSuccess = false;
                    response.Message = "SQL Exception: " + sqlEx.Message;
                }
            }
            catch (Exception ex)
            {
              
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<LectureProgressResponse> LectureProgress(LectureProgressRequest request)
        {
            LectureProgressResponse response = new LectureProgressResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spFacLectureProgressDetail_Show", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                  
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemester_Id", SqlDbType.Int) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemesterSection_Id", SqlDbType.Int) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piCourse_Id", SqlDbType.Int) { Value = request.CourseId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Direction = ParameterDirection.Output });

          
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                 
                        if (reader.HasRows)
                        {
                            reader.Read();

                            response.IsSuccess = true;
                            response.CourseDesc = reader["sCourse_LongDesc"].ToString();
                            response.ProgramShortDesc = reader["sProgram_ShortDesc"].ToString();
                            response.SemesterSectionName = reader["cSemesterSection_Name"].ToString();
                        }

                
                        if (reader.NextResult())
                        {
                      
                            response.LectureDetails = new List<LectureDetail>();
                            while (reader.Read())
                            {
                                LectureDetail lectureDetail = new LectureDetail
                                {
                                    LectureNo = Convert.ToInt32(reader["hFacLectureProgressDetail_LectureNo"]),
                                    LectureDate = reader["LectureDate"].ToString(),
                                    ClassStartTime = reader["ClassStartTime"].ToString(),
                                    ClassEndTime = reader["ClassEndTime"].ToString(),
                                    ClassStatus = reader["ClassStatus"].ToString(),
                                    TopicsCovered = reader["sFacLectureProgressDetail_TopicsCovered"].ToString(),
                                    ClassActivity = reader["sFacLectureProgressDetail_ClassActivity"].ToString(),
                                    IsAttendanceMarked = Convert.ToBoolean(reader["bFacLectureProgressDetail_IsAttendanceMark"]),
                                    ClassTime = reader["ClassTime"].ToString()
                                };

                                response.LectureDetails.Add(lectureDetail);
                                response.Message = "Succesfull";
                            }
                        }

                    }
                }
                int totalLectureCount = response.LectureDetails.Count;
                response.TotalLectureCount = totalLectureCount;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<LectureAttendanceResponse> LectureAttendance(LectureAttendanceRequest request)
        {
            LectureAttendanceResponse response = new LectureAttendanceResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spGetCourseLectureAttendance", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterId", SqlDbType.Int) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterSectionId", SqlDbType.Int) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@UserId", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@CourseId", SqlDbType.Int) { Value = request.CourseId });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        response.IsSuccess = true;
                        response.Message = "Successful";
                        response.Lectures = new List<LectureAttendanceDetail>();

                        while (reader.Read())
                        {
                            int lectureNo = reader["tFacCourseOutlineDetail_LectureNo"] == DBNull.Value ? 0 : Convert.ToInt32(reader["tFacCourseOutlineDetail_LectureNo"]);
                            string attendanceStatus = reader["Attendance"] == DBNull.Value ? string.Empty : reader["Attendance"].ToString();

                            // Check if lecture already exists in response
                            var existingLecture = response.Lectures.FirstOrDefault(l => l.LectureNo == lectureNo);

                            if (existingLecture == null)
                            {
                                existingLecture = new LectureAttendanceDetail
                                {
                                    LectureNo = lectureNo,
                                    StudentAttendances = new List<StudentAttendance>()
                                };

                                response.Lectures.Add(existingLecture);
                            }

                            string regNo = reader["RegNo"] == DBNull.Value ? string.Empty : reader["RegNo"].ToString();
                            string studentName = reader["StudentName"] == DBNull.Value ? string.Empty : reader["StudentName"].ToString();

                            // Add student attendance for current lecture
                            existingLecture.StudentAttendances.Add(new StudentAttendance
                            {
                                RegNo = regNo,
                                StudentName = studentName,
                                Attendance = attendanceStatus
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<CourseInformationResponse> CourseInformation(CourseInformationRequest request)
        {
            CourseInformationResponse response = new CourseInformationResponse();
            response.CourseInformationList = new List<CourseInformationItem>();

            try
            {
                _sqlConnection.Open();

                foreach (var courseInfo in request.RolDegProCouList)
                {
                    CourseInformationItem courseInfoItem = new CourseInformationItem();

                    if (courseInfo.ContainsKey("Role") && courseInfo["Role"] == "2")
                    {
                        courseInfoItem.SemesterID = courseInfo.ContainsKey("SemesterID") ? Convert.ToInt32(courseInfo["SemesterID"]) : 0;
                        courseInfoItem.SemesterSectionID = courseInfo.ContainsKey("SemesterSectionId") ? Convert.ToInt32(courseInfo["SemesterSectionId"]) : 0;
                        courseInfoItem.CourseID = courseInfo.ContainsKey("Course") ? Convert.ToInt32(courseInfo["Course"]) : 0;
                        using (SqlCommand sqlCommand = new SqlCommand("spFacLectureProgressDetail_Show", _sqlConnection))
                        {
                            sqlCommand.CommandType = CommandType.StoredProcedure;
                            sqlCommand.Parameters.Add(new SqlParameter("@piSemester_Id", SqlDbType.Int) { Value = courseInfo.ContainsKey("SemesterID") ? courseInfo["SemesterID"] : DBNull.Value });
                            sqlCommand.Parameters.Add(new SqlParameter("@piSemesterSection_Id", SqlDbType.Int) { Value = courseInfo.ContainsKey("SemesterSectionId") ? courseInfo["SemesterSectionId"] : DBNull.Value });
                            sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                            sqlCommand.Parameters.Add(new SqlParameter("@piCourse_Id", SqlDbType.Int) { Value = courseInfo.ContainsKey("Course") ? courseInfo["Course"] : DBNull.Value });
                            sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Direction = ParameterDirection.Output });

                            using (SqlDataReader reader = sqlCommand.ExecuteReader())
                            {
                         
                                if (reader.HasRows)
                                {
                                    reader.Read();

                                    response.IsSuccess = true;
                                    courseInfoItem.CourseName = reader["sCourse_LongDesc"].ToString();
                                    courseInfoItem.ProgramName = reader["sProgram_ShortDesc"].ToString();
                                    courseInfoItem.SemesterSectionName = reader["cSemesterSection_Name"].ToString();
                                    courseInfoItem.SemesterNo = reader["tSemester_No"].ToString();
                                }
                                else
                                {
                                    courseInfoItem.CourseName = "N/A";
                                    courseInfoItem.ProgramName = "N/A";
                                    courseInfoItem.SemesterSectionName = "N/A";
                                    courseInfoItem.SemesterNo = "0";
                                }
                            }
                        }
                        response.CourseInformationList.Add(courseInfoItem);
                    }
                }

                response.IsSuccess = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception: " + ex.Message;
            }
            finally
            {
                if (_sqlConnection.State == ConnectionState.Open)
                {
                    _sqlConnection.Close();
                }
            }

            return response;
        }

        public async Task<FacLectureProgressInsertResponse> FacLectureProgressInsert(FacLectureProgressInsertRequest request)
        {
            FacLectureProgressInsertResponse response = new FacLectureProgressInsertResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spFacLectureProgressDetail_Insert", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    // Add parameters required by your stored procedure
                    sqlCommand.Parameters.Add(new SqlParameter("@psCreatedBy", SqlDbType.VarChar) { Value = request.CreatedBy });
                    sqlCommand.Parameters.Add(new SqlParameter("@piProcess_Id", SqlDbType.Decimal) { Value = request.ProcessId });
                    sqlCommand.Parameters.Add(new SqlParameter("@ptCampus_Id", SqlDbType.TinyInt) { Value = request.CampusId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piOfferedCourses_Course_Id", SqlDbType.Decimal) { Value = request.OfferedCoursesCourseId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemester_Id", SqlDbType.Decimal) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemesterSection_Id", SqlDbType.Decimal) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@phFacLectureProgressDetail_LectureNo", SqlDbType.SmallInt) { Value = request.LectureNo });
                    sqlCommand.Parameters.Add(new SqlParameter("@pxFacLectureProgressDetail_LectureDate", SqlDbType.DateTime) { Value = request.LectureDate });
                    sqlCommand.Parameters.Add(new SqlParameter("@pxFacLectureProgressDetail_ClassStartTime", SqlDbType.DateTime) { Value = request.ClassStartTime });
                    sqlCommand.Parameters.Add(new SqlParameter("@pxFacLectureProgressDetail_ClassEndTime", SqlDbType.DateTime) { Value = request.ClassEndTime });
                    sqlCommand.Parameters.Add(new SqlParameter("@pcFacLectureProgressDetail_ClassStatus", SqlDbType.Char) { Value = request.ClassStatus });
                    sqlCommand.Parameters.Add(new SqlParameter("@psFacLectureProgressDetail_TopicsCovered", SqlDbType.Text) { Value = request.TopicsCovered });
                    sqlCommand.Parameters.Add(new SqlParameter("@pbFacLectureProgressDetail_IsAttendanceMark", SqlDbType.Bit) { Value = request.IsAttendanceMark });
                    sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Value = 0 });
                    sqlCommand.Parameters.Add(new SqlParameter("@sFacLectureProgressDetail_ClassActivity", SqlDbType.VarChar) { Value = request.ClassActivity });
                  
                    sqlCommand.ExecuteNonQuery();

                  
                    int returnValue = Convert.ToInt32(sqlCommand.Parameters["@piRetVal"].Value);

                
                    if (returnValue == 0)
                    {
                        response.IsSuccess = true;
                        response.Message = "Successful";
                    }
                    else
                    {
                        response.IsSuccess = false;
                        response.Message = "Error occurred in stored procedure. ReturnValue: " + returnValue;
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<UnmarkedLectureNumbersResponse> UnmarkedLectureNumbers(UnmarkedLectureNumbersRequest request)
        {
            UnmarkedLectureNumbersResponse response = new UnmarkedLectureNumbersResponse();
            response.UnmarkedLectureNumbers = new List<int>();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spFacLectureProgressDetail_Show", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add(new SqlParameter("@piSemester_Id", SqlDbType.Int) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemesterSection_Id", SqlDbType.Int) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piCourse_Id", SqlDbType.Int) { Value = request.CourseId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Direction = ParameterDirection.Output });

                 
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                       
                        if (reader.NextResult())
                        {
                     
                            while (reader.Read())
                            {
                                bool isAttendanceMarked = Convert.ToBoolean(reader["bFacLectureProgressDetail_IsAttendanceMark"]);

                                if (!isAttendanceMarked)
                                {
                                    int lectureNumber = Convert.ToInt32(reader["hFacLectureProgressDetail_LectureNo"]);
                                    response.UnmarkedLectureNumbers.Add(lectureNumber);
                                }
                            }
                        }
                    }

                    response.IsSuccess = true;
                    response.Message = "Successful";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<StudentListResponse> StudentList(StudentListRequest request)
        {
            StudentListResponse response = new StudentListResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spGetCourseLectureAttendance", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

             
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterId", SqlDbType.Int) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterSectionId", SqlDbType.Int) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@UserId", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@CourseId", SqlDbType.Int) { Value = request.CourseId });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        DataTable dataTable = new DataTable();
                        dataTable.Load(reader);

                        response.IsSuccess = true;
                        response.Students = new List<Student>();

                        foreach (DataRow row in dataTable.Rows)
                        {
                            string regNo = row["RegNo"].ToString();
                            string studentName = row["StudentName"].ToString();

                   
                            if (!string.IsNullOrEmpty(regNo) && !string.IsNullOrEmpty(studentName))
                            {
                          
                                int stdMainId = GetStdMainIdByRollNumber(regNo);

                              
                                var existingStudent = response.Students.FirstOrDefault(s => s.RegNo == regNo);

                                if (existingStudent == null)
                                {
                             
                                    existingStudent = new Student
                                    {
                                        RegNo = regNo,
                                        StudentName = studentName,
                                        StdMainId = stdMainId
                                    };

                                    response.Students.Add(existingStudent);
                                }

                                response.Message = "Successful";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

     
        private int GetStdMainIdByRollNumber(string rollNumber)
        {
            int stdMainId = -1; 

            try
            {
                if (_sqlConnection.State != ConnectionState.Open)
                {
                    _sqlConnection.Open();
                }

                using (SqlCommand sqlCommand = new SqlCommand("SELECT iStdMain_Id FROM StdMain WHERE sStdMain_RollNo = @RollNumber", _sqlConnection))
                {
                    sqlCommand.Parameters.Add(new SqlParameter("@RollNumber", SqlDbType.VarChar) { Value = rollNumber });

                    object result = sqlCommand.ExecuteScalar();

                    if (result != null && result != DBNull.Value)
                    {
                        stdMainId = Convert.ToInt32(result);
                    }
                }
            }
            catch (Exception ex)
            {
             
                Console.WriteLine("Exception Message: " + ex.Message);
            }
            finally
            {
                if (_sqlConnection.State == ConnectionState.Open)
                {
                    _sqlConnection.Close();
                }
            }

            return stdMainId;
        }

        public async Task<LectureAttendanceSummaryResponse> LectureAttendanceSummary(LectureAttendanceSummaryRequest request)
        {
            LectureAttendanceSummaryResponse response = new LectureAttendanceSummaryResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spGetCourseLectureAttendance", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterId", SqlDbType.Int) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterSectionId", SqlDbType.Int) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@UserId", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@CourseId", SqlDbType.Int) { Value = request.CourseId });

                    int totalStudentsInCourse = 0;
                    Dictionary<int, int> lectureAttendanceCounts = new Dictionary<int, int>();

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        response.IsSuccess = true;

                        // Track unique students for total count
                        HashSet<string> uniqueStudents = new HashSet<string>();

                        while (reader.Read())
                        {
                            string regNo = reader["RegNo"].ToString();
                            string attendanceStatus = reader["Attendance"].ToString();

                            // Count total unique students
                            if (uniqueStudents.Add(regNo))
                            {
                                totalStudentsInCourse++;
                            }

                            // Only count attendance if status is "P" (Present)
                            if (attendanceStatus == "P")
                            {
                                int lectureNo = Convert.ToInt32(reader["tFacCourseOutlineDetail_LectureNo"]);

                                if (lectureAttendanceCounts.ContainsKey(lectureNo))
                                {
                                    lectureAttendanceCounts[lectureNo]++;
                                }
                                else
                                {
                                    lectureAttendanceCounts.Add(lectureNo, 1);
                                }
                            }
                        }
                    }

                    response.TotalStudentsInCourse = totalStudentsInCourse;
                    response.LectureAttendanceCounts = lectureAttendanceCounts;

                    response.Message = "Successful";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<UserProfileResponse> UserProfile(UserProfileRequest request)
        {
            UserProfileResponse response = new UserProfileResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spGetUsersProfile", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

            
                    sqlCommand.Parameters.Add(new SqlParameter("@UserProfile", SqlDbType.VarChar) { Value = request.UserId });

                   
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                      
                        if (reader.Read())
                        {
                            response.IsSuccess = true;
                            response.Message = "User Exist";
                            response.UserId = request.UserId;
                            response.FirstName = reader["sUserProfile_FirstName"].ToString();
                            response.LastName = reader["sUserProfile_LastName"].ToString();
                            response.Email = reader["sUserProfile_Email"].ToString();
                            response.Number = reader["sUserProfile_Mobile"].ToString();
                            response.CNIC = reader["sUserProfile_NIC"].ToString();
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "Unsuccessfull";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<InsertCourseLectureAttendanceResponse> InsertCourseLectureAttendance(InsertCourseLectureAttendanceRequest request)
        {
            InsertCourseLectureAttendanceResponse response = new InsertCourseLectureAttendanceResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("spCourseLectureAttendance_Insert", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add(new SqlParameter("@psCreatedBy", SqlDbType.VarChar) { Value = request.CreatedBy });
                    sqlCommand.Parameters.Add(new SqlParameter("@pxCourseLectureAttendence_Date", SqlDbType.DateTime) { Value = request.CourseLectureAttendanceDate });
                    sqlCommand.Parameters.Add(new SqlParameter("@ptCourseLectureAttendence_LectureNo", SqlDbType.TinyInt) { Value = request.CourseLectureAttendanceLectureNo });
                    sqlCommand.Parameters.Add(new SqlParameter("@piOfferedCourses_Course_Id", SqlDbType.Decimal) { Value = request.OfferedCoursesCourseId });
                    sqlCommand.Parameters.Add(new SqlParameter("@psUser_Id", SqlDbType.VarChar) { Value = request.UserId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemester_Id", SqlDbType.Decimal) { Value = request.SemesterId });
                    sqlCommand.Parameters.Add(new SqlParameter("@piSemesterSection_Id", SqlDbType.TinyInt) { Value = request.SemesterSectionId });
                    sqlCommand.Parameters.Add(new SqlParameter("@pbFacLectureProgressDetail_IsAttendanceMark", SqlDbType.Bit) { Value = 1 });
                    sqlCommand.Parameters.Add(new SqlParameter("@psLectureAttendance", SqlDbType.VarChar, 5000) { Value = request.LectureAttendance });

                    sqlCommand.ExecuteNonQuery();

                    response.IsSuccess = true;
                    response.Message = "Attendance inserted successfully.";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<FacCourseOutlineShowResponse> FacCourseOutlineShow(FacCourseOutlineShowRequest request)
        {
            FacCourseOutlineShowResponse response = new FacCourseOutlineShowResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand command = new SqlCommand("spFacCourseOutline_Show", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    command.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    command.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    command.Parameters.AddWithValue("@piCourse_Id", request.CourseId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            // Read class head info
                            if (reader.Read())
                            {
                                response.CourseLongDesc = reader["sCourse_LongDesc"].ToString();
                                response.ProgramShortDesc = reader["sProgram_ShortDesc"].ToString();
                                response.SemesterSectionName = reader["cSemesterSection_Name"].ToString();
                                response.SemesterNo = reader["tSemester_No"].ToString();
                                response.ReturnValue = Convert.ToInt32(reader["iReturnValue"]);
                                response.PreRequisite = reader["PreRequisite"].ToString();
                                response.FacultyFullName = reader["FacultyFullName"].ToString();
                            }

                            // Read FacCoursOutline header info
                            if (reader.NextResult() && reader.Read())
                            {
                                response.PostedDate = Convert.ToDateTime(reader["xFacCourseOutline_PostedDate"]);
                                response.Summary = reader["sFacCourseOutline_Summary"].ToString();
                                response.IsPosted = Convert.ToBoolean(reader["bFacCourseOutline_Posted"]);
                                response.ClassTiming = reader["sFacCourseOutline_ClassTiming"].ToString();
                                response.Session = reader["sFacCourseOutline_Session"].ToString();
                                response.ConsultationTime = reader["sFacCourseOutline_ConsultationTime"].ToString();
                                response.EmailAddress = reader["sFacCourseOutline_EmailAddress"].ToString();
                                response.ContactNo = reader["sFacCourseOutline_ContactNo"].ToString();
                                response.LearningOutcomes = reader["sFacCourseOutline_LearningOutcomes"].ToString();
                                response.LearningStrategies = reader["sFacCourseOutline_LearningStrategies"].ToString();
                                response.ClassStartTime = reader["sClassStartTime"].ToString();
                                response.ClassEndTime = reader["sClassEndTime"].ToString();
                                response.TeachingLearningMethod = reader["sTeachLearnMethod"].ToString();
                                response.Materials = reader["sMaterials"].ToString();
                                response.ClassConduct = reader["sClassConduct"].ToString();
                                response.CourseDescription = reader["sCourseDescription"].ToString();
                                response.CourseObjectives = reader["sCourseObjectives"].ToString();
                            }

                            // Read FacCoursOutline Lectures info
                            if (reader.NextResult())
                            {
                                response.Lectures = new List<FacCourseOutlineLecture>();
                                while (reader.Read())
                                {
                                    FacCourseOutlineLecture lecture = new FacCourseOutlineLecture();
                                    lecture.LectureNo = Convert.ToByte(reader["tFacCourseOutlineDetail_LectureNo"]);
                                    lecture.LectureDetail = reader["sFacCourseOutlineDetail_LectureDetail"].ToString();
                                    response.Lectures.Add(lecture);
                                }
                            }
                        }
                    }
                }

                response.IsSuccess = true;
                response.Message = "Course outline retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }

            return response;
        }

        public async Task<CourseRecapSheetDataResponse> CourseRecapSheetData(CourseRecapSheetDataRequest request)
        {
            CourseRecapSheetDataResponse response = new CourseRecapSheetDataResponse();

            try
            {
                _sqlConnection.Open();

                // Get mark head data
                List<MarkHeadData> markHeads = new List<MarkHeadData>();

                using (SqlCommand command = new SqlCommand("spGetCourseRecapSheetData", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", request.UserId);
                    command.Parameters.AddWithValue("@CourseId", request.CourseId);
                    command.Parameters.AddWithValue("@SemesterId", request.SemesterId);
                    command.Parameters.AddWithValue("@SectionId", request.SectionId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                byte markHeadId = reader.GetByte(reader.GetOrdinal("tMarksHead_id"));
                                String markHeadName = reader.GetString(reader.GetOrdinal("MarksHead"));

                                MarkHeadData markHead = markHeads.FirstOrDefault(m => m.MarkHeadId == markHeadId);
                                if (markHead == null)
                                {
                                    markHead = new MarkHeadData { MarkHeadId = markHeadId, Students = new List<StudentMarks>(), MarkHeadName = markHeadName  };
                                    markHeads.Add(markHead);
                                }

                                markHead.Students.Add(new StudentMarks
                                {
                                    RegNo = reader.GetString(reader.GetOrdinal("RegNo")),
                                    StudentName = reader.GetString(reader.GetOrdinal("StudentName"))
                                    
                                });
                            }
                        }
                    }
                }

                response.MarkHeads = markHeads;
                response.IsSuccess = true;
                response.Message = "Data retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }

            return response;
        }

        public async Task<CourseOutlineMarksDistributionResponse> CourseOutlineMarksDistribution(CourseOutlineMarksDistributionRequest request)
        {
            CourseOutlineMarksDistributionResponse response = new CourseOutlineMarksDistributionResponse();

            try
            {
                _sqlConnection.Open();
   
                    List<CourseMarksDistributionData> marksDistribution = new List<CourseMarksDistributionData>();

                    using (SqlCommand command = new SqlCommand("spCourseOutline_MarksDistribution", _sqlConnection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Set stored procedure parameters
                        command.Parameters.AddWithValue("@psUser_Id", request.UserId);
                        command.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                        command.Parameters.AddWithValue("@piSemesterSection_Id", request.SectionId);
                        command.Parameters.AddWithValue("@piCourse_Id", request.CourseId);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                            // Read data and populate marksDistribution list
                                byte marksHeadId = reader.GetByte(reader.GetOrdinal("tMarksHead_id"));
                                string marksHeadDescription = reader.GetString(reader.GetOrdinal("sMarksHead_LongDesc"));
                                byte totalFrequency = reader.GetByte(reader.GetOrdinal("tTotalFrequency"));
                                byte totalExempted = reader.GetByte(reader.GetOrdinal("tTotalExempted"));
                                double totalMarks = reader.GetDouble(reader.GetOrdinal("fTotalMarks"));

                                marksDistribution.Add(new CourseMarksDistributionData
                                {
                                    MarksHeadId = marksHeadId,
                                    MarksHeadDescription = marksHeadDescription,
                                    TotalFrequency = totalFrequency,
                                    TotalExempted = totalExempted,
                                    TotalMarks = totalMarks
                                });
                            }
                        }
                    }

                    response.MarksDistribution = marksDistribution;
                    response.IsSuccess = true;
                    response.Message = "Data retrieved successfully.";
                
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }

            return response;
        }

        public async Task<FacStdRecapSheetShowRecapResponse> FacStdRecapSheetShowRecap(FacStdRecapSheetShowRecapRequest request)
        {
            FacStdRecapSheetShowRecapResponse response = new FacStdRecapSheetShowRecapResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand command = new SqlCommand("spFacStdRecapSheet_Show_RecapUpdate", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    command.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    command.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    command.Parameters.AddWithValue("@piCourse_Id", request.CourseId);
                    command.Parameters.AddWithValue("@psMarksHead", request.MarksHeadId);
                    command.Parameters.AddWithValue("@psSerialNo", request.SerialNo);
                    command.Parameters.AddWithValue("@piRetVal", value:1);


                    List<MarksRecapInfo> result1 = new List<MarksRecapInfo>();
                    List<StudentRecapInfo> result2 = new List<StudentRecapInfo>();

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        // First result set
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                MarksRecapInfo info = new MarksRecapInfo();
                                info.UserId = reader.GetString(reader.GetOrdinal("sUser_Id"));

                                info.MarksHeadId = reader.GetByte(reader.GetOrdinal("tMarksHead_Id"));

                                info.SemesterSectionId = reader.GetByte(reader.GetOrdinal("iSemesterSection_Id"));
                                info.MarksTypeSerialNo = reader.GetInt16(reader.GetOrdinal("hCourseRecapSheet_MarksTypeSerialNo"));
                                info.TotalMarks = reader.GetDouble(reader.GetOrdinal("fCourseRecapSheet_TotalMarks"));
                                result1.Add(info);
                            }
                        }

                        // Move to the next result set
                        await reader.NextResultAsync();

                        // Second result set
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                StudentRecapInfo info = new StudentRecapInfo();

                                info.StdMainId = reader.GetDecimal(reader.GetOrdinal("iStdMain_Id"));
                                info.RegistrationNo = reader.GetString(reader.GetOrdinal("RegistrationNo"));
                                info.Name = reader.GetString(reader.GetOrdinal("Name"));
                                info.MarksObtained = reader.IsDBNull(reader.GetOrdinal("fCourseRecapSheet_MarksObtained")) ? null : reader.GetString(reader.GetOrdinal("fCourseRecapSheet_MarksObtained"));
                                result2.Add(info);
                            }
                        }
                    }

                    response.IsSuccess = true;
                    response.Message = "Data retrieved successfully.";
                    response.MarksHeadInfo = result1;
                    response.StudentInfo = result2;
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<FacStdRecapSheetInsertResponse> FacStdRecapSheetInsert(FacStdRecapSheetInsertRequest request)
        {
            FacStdRecapSheetInsertResponse response = new FacStdRecapSheetInsertResponse();

            try
            {
                _sqlConnection.Open();

                foreach (var student in request.Students)
                {
                    using (SqlCommand command = new SqlCommand("spFacStdRecapSheet_Insert", _sqlConnection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@pssUser_Id", request.UserId);
                        command.Parameters.AddWithValue("@psiStdMain_Id", student.StdMainId);
                        command.Parameters.AddWithValue("@psiOfferedCourses_Course_Id", request.OfferedCoursesCourseId);
                        command.Parameters.AddWithValue("@pstMarksHead_Id", request.MarksHeadId);
                        command.Parameters.AddWithValue("@psiSemester_Id", request.SemesterId);
                        command.Parameters.AddWithValue("@psiSemesterSection_Id", request.SemesterSectionId);
                        command.Parameters.AddWithValue("@pshCourseRecapSheet_MarksTypeSerialNo", request.MarksTypeSerialNo);
                        command.Parameters.AddWithValue("@psfCourseRecapSheet_MarksObtained", student.MarksObtained);
                        command.Parameters.AddWithValue("@psfCourseRecapSheet_TotalMarks", request.TotalMarks);
                        command.Parameters.AddWithValue("@pssCreatedBy", request.CreatedBy);
                        command.Parameters.AddWithValue("@pssModifiedBy", request.ModifiedBy);
                        command.Parameters.AddWithValue("@psShowResult", request.ShowResult);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                response.IsSuccess = true;
                response.Message = "Data inserted successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<ForgotPasswordResponse> ForgotPassword(ForgotPasswordRequest request)
        {
            ForgotPasswordResponse response = new ForgotPasswordResponse();

            try
            {
                await _sqlConnection.OpenAsync();

                // Check if the user exists in the database
                using (SqlCommand sqlCommand = new SqlCommand("spGetUsersProfile", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@UserProfile", SqlDbType.VarChar) { Value = request.UserId });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // User exists, generate verification code
                            Random random = new Random();
                            int verificationCode = random.Next(1000, 9999);

                            // Send SMS with verification code
                            string phoneNumber = "923353211306"; // Change to recipient phone number
                            string message = $"Your verification code is: {verificationCode}";

                            var client = new RestClient("https://xl8deg.api.infobip.com");
                            var smsRequest = new RestRequest("/sms/2/text/advanced", Method.Post);
                            smsRequest.AddHeader("Authorization", "App 0e877adafc883b18b31c2e6284eb7d86-c6eb93a1-4baa-4429-a319-cd05ff976c7f");
                            smsRequest.AddHeader("Content-Type", "application/json");
                            smsRequest.AddHeader("Accept", "application/json");
                            smsRequest.AddParameter("application/json", $"{{\"messages\":[{{\"destinations\":[{{\"to\":\"{phoneNumber}\"}}],\"from\":\"ServiceSMS\",\"text\":\"{message}\"}}]}}", ParameterType.RequestBody);

                            var smsResponse = await client.ExecuteAsync(smsRequest);

                            if (smsResponse.IsSuccessful)
                            {
                                // Set response properties
                                response.IsSuccess = true;
                                response.Message = "Verification code sent successfully via SMS.";
                                response.VerificationCode = verificationCode.ToString("D4"); // Format the code as 4 digits
                            }
                            else
                            {
                                // Handle SMS sending failure
                                response.IsSuccess = false;
                                response.Message = "Failed to send verification code via SMS: " + smsResponse.ErrorMessage;
                            }
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "User not found.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<ConversationResponse> Conversation(ConversationRequest request)
        {
            ConversationResponse response = new ConversationResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("ViewConversations", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@UserID", SqlDbType.VarChar) { Value = request.UserId });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            response.IsSuccess = true;
                            response.Message = "Conversations Found";
                            response.Conversations = new List<Conversation>();

                            while (reader.Read())
                            {
                                Conversation conversation = new Conversation();
                                conversation.ConversationID = Convert.ToInt32(reader["ConversationID"]);
                                conversation.OtherUserID = reader["OtherUserID"].ToString();
                                conversation.OtherUserFirstName = reader["OtherUserFirstName"].ToString();
                                conversation.OtherUserLastName = reader["OtherUserLastName"].ToString();
                                conversation.OtherUserEmail = reader["OtherUserEmail"].ToString();
                                conversation.OtherUserNumber = reader["OtherUserNumber"].ToString();
                                conversation.OtherUserCNIC = reader["OtherUserCNIC"].ToString();

                                response.Conversations.Add(conversation);
                            }
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "No Conversations Found";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<ViewMessagesResponse> ViewMessages(ViewMessagesRequest request)
        {
            ViewMessagesResponse response = new ViewMessagesResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("ViewMessages", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@ConversationID", SqlDbType.Int) { Value = request.ConversationID });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            response.IsSuccess = true;
                            response.Message = "Messages Found";
                            response.Messages = new List<Message>();

                            while (reader.Read())
                            {
                                Message message = new Message();
                                message.MessageID = Convert.ToInt32(reader["MessageID"]);
                                message.SenderID = reader["SenderID"].ToString();
                                message.Content = reader["Content"].ToString();
                                message.Timestamp = Convert.ToDateTime(reader["Timestamp"]);

                                response.Messages.Add(message);
                            }
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "No Messages Found";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            SendMessageResponse response = new SendMessageResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("SendMessage", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@SenderID", SqlDbType.VarChar) { Value = request.SenderID });
                    sqlCommand.Parameters.Add(new SqlParameter("@RecipientID", SqlDbType.VarChar) { Value = request.RecipientID });
                    sqlCommand.Parameters.Add(new SqlParameter("@Content", SqlDbType.VarChar) { Value = request.Content });
                    sqlCommand.Parameters.Add(new SqlParameter("@Timestamp", SqlDbType.DateTime) { Value = request.Timestamp });

                    // Execute the stored procedure
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            response.IsSuccess = true;
                            response.Message = "Message Sent Successfully";
                            // Optional: Get the newly created message's ID
                            response.MessageID = Convert.ToInt32(reader["MessageID"]);
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "Failed to send message";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<GetUserProfileResponse> GetUserProfile(GetUserProfileRequest request)
        {
            GetUserProfileResponse response = new GetUserProfileResponse();
            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("GetUserProfile", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@SearchInput", SqlDbType.VarChar, 100) { Value = request.SearchInput });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            response.IsSuccess = true;
                            response.Message = "User profiles found";
                            response.UserProfiles = new List<UserProfile>();

                            while (reader.Read())
                            {
                                UserProfile userProfile = new UserProfile();
                                userProfile.UserId = reader["sUser_Id"].ToString();
                                userProfile.FirstName = reader["sUserProfile_FirstName"].ToString();
                                userProfile.MiddleName = reader["sUserProfile_MiddleName"].ToString();
                                userProfile.LastName = reader["sUserProfile_LastName"].ToString();

                                response.UserProfiles.Add(userProfile);
                            }
                        }
                        else
                        {
                            response.IsSuccess = true;
                            response.Message = "No user profiles found";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<PortfolioFileResponse> PortfolioFile(PortfolioFileRequest request)
        {
            PortfolioFileResponse response = new PortfolioFileResponse();
            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("spGetStdCoursePortFolioFiles", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    sqlCommand.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    sqlCommand.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    sqlCommand.Parameters.AddWithValue("@piCourse_Id", request.CourseId);

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            response.IsSuccess = true;
                            response.Message = "Portfolio Files Found";
                            response.PortfolioFiles = new List<PortfolioFile>();

                            while (await reader.ReadAsync())
                            {
                                PortfolioFile portfolioFile = new PortfolioFile();
                                portfolioFile.WeekNumber = Convert.ToInt32(reader["WeekNumber"]);
                                portfolioFile.Description = reader["Description"].ToString();
                                portfolioFile.Title = reader["Title"].ToString();
                                portfolioFile.FileLocation = reader["FileLocation"].ToString();
                                portfolioFile.DateCreated = Convert.ToDateTime(reader["DateCreated"]);
                                portfolioFile.FacCoursePortfolioId = Convert.ToInt32(reader["FacCoursePortfolio_id"]);

                                response.PortfolioFiles.Add(portfolioFile);
                            }
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "No Portfolio Files Found";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<RecapSheetRecordResponse> RecapSheetRecord(RecapSheetRecordRequest request)
        {
            RecapSheetRecordResponse response = new RecapSheetRecordResponse();
            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand command = new SqlCommand("spCoorStdRecapSheet_Show_update", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    command.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    command.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    command.Parameters.AddWithValue("@piOfferedCourses_Course_Id", request.CourseId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        // Move to the third result set (Recap sheet records)
                        reader.NextResult();
                        reader.NextResult();

                        // Third result set parsing (Recap sheet records)
                        if (reader.HasRows)
                        {
                            response.IsSuccess = true;
                            response.Message = "Recap sheet records found";
                            response.RecordsByStudent = new Dictionary<int, StudentRecapRecord>();

                            while (await reader.ReadAsync())
                            {
                                int studentId = Convert.ToInt32(reader["iStdMain_Id"]);

                                if (!response.RecordsByStudent.ContainsKey(studentId))
                                {
                                    response.RecordsByStudent[studentId] = new StudentRecapRecord
                                    {
                                        StudentId = studentId,
                                        FullName = reader["sStdProfile_FullName"].ToString(),
                                        RegistrationNo = reader["sStdMain_RegistrationNo"].ToString(),
                                        Marks = new List<Mark>()
                                    };
                                }

                                response.RecordsByStudent[studentId].Marks.Add(new Mark
                                {
                                    MarksHeadId = Convert.ToByte(reader["tMarksHead_Id"]),
                                    MarksTypeSerialNo = Convert.ToInt16(reader["hCourseRecapSheet_MarksTypeSerialNo"]),
                                    MarksObtained = Convert.ToSingle(reader["fCourseRecapSheet_MarksObtained"]),
                                    TotalMarks = Convert.ToSingle(reader["fCourseRecapSheet_TotalMarks"]),
                                    
                                });
                            }
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.Message = "No recap sheet records found";
                        }

                        // Move to the fifth result set (Grading plan)
                        reader.NextResult();
                        reader.NextResult();
                        reader.NextResult();
                        reader.NextResult();

                        // Fifth result set parsing (Grading plan)
                        if (reader.HasRows)
                        {
                            response.GradingPlan = new List<GradingPlan>();

                            while (await reader.ReadAsync())
                            {
                                GradingPlan plan = new GradingPlan
                                {
                                    GradingPlanId = Convert.ToInt32(reader["tGradingPlan_Id"]),
                                    Grade = reader["sGradingPlan_Grade"].ToString(),
                                    MarksFrom = Convert.ToSingle(reader["fGradingPlan_MarksFrom"]),
                                    MarksTo = Convert.ToSingle(reader["fGradingPlan_MarksTo"]),
                                    GPA = Convert.ToSingle(reader["fGradingPlan_GPA"])
                                };

                                response.GradingPlan.Add(plan);
                            }
                        }
                        else
                        {
                            response.Message += ". Grading plan not found";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }

            return response;
        }
        public async Task<FacGuidelineResponse> FacGuideline(FacGuidelineRequest request)
        {
            FacGuidelineResponse response = new FacGuidelineResponse();

            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("spFacGuideline_Show", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.AddWithValue("@ptCampus_Id", request.CampusId);
                    sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Value = 1 });
                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        response.IsSuccess = true;
                        response.Message = "Fac Guidelines Found";
                        response.FacGuidelines = new List<FacGuideline>();

                        while (reader.Read())
                        {
                            FacGuideline guideline = new FacGuideline();
                            guideline.HeadId = Convert.ToInt32(reader["tFacGuidelineHead_Id"]);
                            guideline.HeadShortDesc = reader["sFacGuidelineHead_ShortDesc"].ToString();
                            guideline.HeadLongDesc = reader["sFacGuidelineHead_LongDesc"].ToString();
                            guideline.DetailId = Convert.ToInt32(reader["hFacGuidelineHeadDetail_Id"]);
                            guideline.DetailDesc = reader["sFacGuidelineHeadDetail_Desc"].ToString();
                            guideline.PostedBy = reader["sFacGuidelineHeadDetail_PostedBy"].ToString();
                            guideline.IsLocked = Convert.ToBoolean(reader["bIsLock"]);

                            response.FacGuidelines.Add(guideline);
                        }
                    }

                    response.ReturnValue = Convert.ToInt32(sqlCommand.Parameters["@piRetVal"].Value);
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                await _sqlConnection.CloseAsync();
            }

            return response;
        }

        public async Task<OfferedCoursesResponse> OfferedCourse(OfferedCoursesRequest request)
        {
            OfferedCoursesResponse response = new OfferedCoursesResponse();

            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("spZabAdminOfferedCourses", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.AddWithValue("@SemesterYear", request.SemesterYear);
                    sqlCommand.Parameters.AddWithValue("@SemesterType", request.SemesterType);

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        response.IsSuccess = true;
                        response.Message = "Offered courses found";
                        response.Programs = new List<ProgramInfo>();

                        while (reader.Read())
                        {
                            string programName = reader["ProgramName"].ToString();
                            string courseName = reader["CourseName"].ToString();
                            string facultyName = reader["FacultyName"].ToString();
                            string sectionName = reader["SectionName"].ToString();

                            // Check if the program exists in the response, if not, add it
                            ProgramInfo program = response.Programs.FirstOrDefault(p => p.ProgramName == programName);
                            if (program == null)
                            {
                                program = new ProgramInfo
                                {
                                    ProgramName = programName,
                                    Courses = new List<CourseInfo>()
                                };
                                response.Programs.Add(program);
                            }

                            // Add the course to the program
                            program.Courses.Add(new CourseInfo
                            {
                                CourseName = courseName,
                                FacultyName = facultyName,
                                SectionName = sectionName
                            });
                        }
                    }
                }

                // Sort programs by program name
                response.Programs = response.Programs.OrderBy(p => p.ProgramName).ToList();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                await _sqlConnection.CloseAsync();
            }

            return response;
        }

        public async Task<InsertFacCourseOutlineResponse> InsertFacCourseOutline(InsertFacCourseOutlineRequest request)
        {
            InsertFacCourseOutlineResponse response = new InsertFacCourseOutlineResponse();

            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("spFacCourseOutline_Insert", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.AddWithValue("@psCreatedBy", request.CreatedBy);
                    sqlCommand.Parameters.AddWithValue("@piProcess_Id", request.ProcessId);
                    sqlCommand.Parameters.AddWithValue("@ptCampus_Id", request.CampusId);
                    sqlCommand.Parameters.AddWithValue("@piRequestType_Id", request.RequestTypeId);
                    sqlCommand.Parameters.AddWithValue("@piOfferedCourse_Id", request.OfferedCourseId);
                    sqlCommand.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    sqlCommand.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    sqlCommand.Parameters.AddWithValue("@psSummary", request.Summary);
                    sqlCommand.Parameters.AddWithValue("@pbPosted", request.Posted);
                    sqlCommand.Parameters.AddWithValue("@psCourseLectureOutline", request.CourseLectureOutline);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_ClassTiming", request.ClassTiming);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_Session", request.Session);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_ConsultationTime", request.ConsultationTime);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_EmailAddress", request.EmailAddress);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_ContactNo", request.ContactNo);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_LearningOutcomes", request.LearningOutcomes);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_LearningStrategies", request.LearningStrategies);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_tClasshour", request.ClassHour);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_tLabhour", request.LabHour);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_sCourseDescription", request.CourseDescription);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_sCourseObjectives", request.CourseObjectives);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_sClassStartTime", request.ClassStartTime);
                    sqlCommand.Parameters.AddWithValue("@psFacCourseOutline_sClassEndTime", request.ClassEndTime);

                    var returnParam = sqlCommand.Parameters.Add("@iReturnValue", SqlDbType.Int);
                    returnParam.Direction = ParameterDirection.ReturnValue;

                    await sqlCommand.ExecuteNonQueryAsync();

                    response.ReturnValue = (int)returnParam.Value;
                    response.IsSuccess = true;
                    response.Message = "Course outline inserted successfully";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                await _sqlConnection.CloseAsync();
            }

            return response;
        }

        public async Task<InsertCoursePortfolioResponse> InsertCoursePortfolio(InsertCoursePortfolioRequest request)
        {
            InsertCoursePortfolioResponse response = new InsertCoursePortfolioResponse();

            try
            {
                await _sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("spFacCoursePortfolio_Insert", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.AddWithValue("@ptCampus_Id", request.CampusId);
                    sqlCommand.Parameters.AddWithValue("@piOfferedCourses_Course_Id", request.OfferedCourseId);
                    sqlCommand.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    sqlCommand.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    sqlCommand.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    sqlCommand.Parameters.AddWithValue("@weekNo", request.WeekNumber);
                    sqlCommand.Parameters.AddWithValue("@description", request.Description);
                    sqlCommand.Parameters.AddWithValue("@title", request.Title);
                    sqlCommand.Parameters.AddWithValue("@fileName", request.FileName);
                    sqlCommand.Parameters.Add(new SqlParameter("@piRetVal", SqlDbType.Int) { Value = 0 });

                    await sqlCommand.ExecuteNonQueryAsync();

                    // Check the return value
                    int returnValue = Convert.ToInt32(sqlCommand.Parameters["@piRetVal"].Value);
                    if (returnValue == 0)
                    {
                        response.IsSuccess = true;
                        response.Message = "Course portfolio inserted successfully.";
                    }
                    else
                    {
                        response.IsSuccess = false;
                        response.Message = "Error occurred while inserting course portfolio.";
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                await _sqlConnection.CloseAsync();
            }

            return response;
        }

        public async Task<GetTotalLectureCountResponse> GetTotalLectureCount(GetTotalLectureCountRequest request)
        {
            GetTotalLectureCountResponse response = new GetTotalLectureCountResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand command = new SqlCommand("spFacCourseOutline_Show", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@psUser_Id", request.UserId);
                    command.Parameters.AddWithValue("@piSemester_Id", request.SemesterId);
                    command.Parameters.AddWithValue("@piSemesterSection_Id", request.SemesterSectionId);
                    command.Parameters.AddWithValue("@piCourse_Id", request.CourseId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            // Skip reading the other details
                            if (reader.NextResult() && reader.NextResult())
                            {
                                // Read lecture numbers from the third result set
                                HashSet<int> lectureNumbers = new HashSet<int>();
                                while (reader.Read())
                                {
                                    int lectureNo = Convert.ToInt32(reader["tFacCourseOutlineDetail_LectureNo"]);
                                    lectureNumbers.Add(lectureNo);
                                }

                                // Count the unique lecture numbers
                                response.TotalLectureCount = lectureNumbers.Count;
                            }
                        }
                    }
                }

                response.IsSuccess = true;
                response.Message = "Total lecture count retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<GetClassSchedularResponse> GetClassSchedular(GetClassSchedularRequest request)
        {
            var response = new GetClassSchedularResponse();

            try
            {
                _sqlConnection.Open();

                using (var command = new SqlCommand("sp_GetClassSchedular", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            var classSchedularList = new List<ClassSchedular>();

                            while (reader.Read())
                            {
                                var classSchedular = new ClassSchedular
                                {
                                    ClassId = Convert.ToInt32(reader["ClassId"]),
                                    ClassScheduleTitle = reader["ClassScheduleTitle"].ToString(),
                                    ClassSubTitle = reader["ClassSubTitle"].ToString(),
                                    ClassSchedularPath = reader["ClassSchedularPath"].ToString(),
                                };

                                classSchedularList.Add(classSchedular);
                            }

                            response.ClassSchedulars = classSchedularList;
                        }
                    }
                }

                response.IsSuccess = true;
                response.Message = "Class schedular data retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<GetDailyClassScheduleDetailsResponse> GetDailyClassScheduleDetails(GetDailyClassScheduleDetailsRequest request)
        {
            var response = new GetDailyClassScheduleDetailsResponse { ClassScheduleDetails = new List<ClassScheduleDetail>() };

            try
            {
                _sqlConnection.Open();

                using (var command = new SqlCommand("spZabAdminClassScheduleDetailsDailyByFacultyDateWise", _sqlConnection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@SemesterYear", request.SemesterYear);
                    command.Parameters.AddWithValue("@SemesterType", request.SemesterType);
                    command.Parameters.AddWithValue("@sUserId", request.UserId);
                    command.Parameters.AddWithValue("@date", request.Date);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                try
                                {
                                    var classScheduleDetail = new ClassScheduleDetail
                                    {
                                        ClassType = reader["ClassType"].ToString(),
                                        CourseName = reader["CourseName"].ToString(),
                                        SectionName = reader["SectionName"].ToString(),
                                        FacultyName = reader["FacultyName"].ToString(),
                                        Date = Convert.ToDateTime(reader["Date"]),
                                        StartTime = reader["StartTime"].ToString(),
                                        EndTime = reader["EndTime"].ToString(),
                                        RoomLabel = reader["RoomLabel"].ToString(),
                                        BuildingId = reader["BuildingId"].ToString(),
                                        SlotNo = Convert.ToInt32(reader["SlotNo"]),
                                        ClassStatusId = reader["cClassStatus_Id"].ToString()
                                    };

                                    response.ClassScheduleDetails.Add(classScheduleDetail);
                                }
                                catch (Exception ex)
                                {
                                    response.IsSuccess = false;
                                    response.Message = $"Error reading data: {ex.Message}";
                                    return response;
                                }
                            }
                        }
                    }
                }

                response.IsSuccess = true;
                response.Message = "Class schedule details retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;
            }
            finally
            {
                _sqlConnection.Close();
            }

            return response;
        }

        public async Task<InsertPDFResponse> InsertPDF(InsertPDFRequest request)
        {
            InsertPDFResponse response = new InsertPDFResponse();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("InsertUploadedPDF", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.Add(new SqlParameter("@sUser_id", SqlDbType.VarChar) { Value = request.sUser_id });
                    sqlCommand.Parameters.Add(new SqlParameter("@CourseID", SqlDbType.Int) { Value = request.CourseID });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterID", SqlDbType.Int) { Value = request.SemesterID });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterSectionID", SqlDbType.Int) { Value = request.SemesterSectionID });
                    sqlCommand.Parameters.Add(new SqlParameter("@FileDescription", SqlDbType.NVarChar) { Value = request.FileDescription });
                    sqlCommand.Parameters.Add(new SqlParameter("@Title", SqlDbType.NVarChar) { Value = request.Title });
                    sqlCommand.Parameters.Add(new SqlParameter("@FileLocation", SqlDbType.NVarChar) { Value = request.FileLocation });

                    await sqlCommand.ExecuteNonQueryAsync();
                }

                response.IsSuccess = true;
                response.Message = "PDF uploaded successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception: " + ex.Message;
            }
            finally
            {
                if (_sqlConnection.State == ConnectionState.Open)
                {
                    _sqlConnection.Close();
                }
            }

            return response;
        }

        public async Task<ViewPDFResponse> ViewPDF(ViewPDFRequest request)
        {
            ViewPDFResponse response = new ViewPDFResponse();
            response.PDFList = new List<PDFItem>();

            try
            {
                _sqlConnection.Open();

                using (SqlCommand sqlCommand = new SqlCommand("ViewUploadedPDFs", _sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.Add(new SqlParameter("@sUser_id", SqlDbType.VarChar) { Value = request.sUser_id ?? (object)DBNull.Value });
                    sqlCommand.Parameters.Add(new SqlParameter("@CourseID", SqlDbType.Int) { Value = request.CourseID ?? (object)DBNull.Value });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterID", SqlDbType.Int) { Value = request.SemesterID ?? (object)DBNull.Value });
                    sqlCommand.Parameters.Add(new SqlParameter("@SemesterSectionID", SqlDbType.Int) { Value = request.SemesterSectionID ?? (object)DBNull.Value });

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            PDFItem pdfItem = new PDFItem
                            {
                                PDFID = Convert.ToInt32(reader["PDFID"]),
                                sUser_id = reader["sUser_id"].ToString(),
                                CourseID = Convert.ToInt32(reader["CourseID"]),
                                SemesterID = Convert.ToInt32(reader["SemesterID"]),
                                SemesterSectionID = Convert.ToInt32(reader["SemesterSectionID"]),
                                FileDescription = reader["FileDescription"].ToString(),
                                Title = reader["Title"].ToString(),
                                FileLocation = reader["FileLocation"].ToString(),
                                DateCreated = Convert.ToDateTime(reader["DateCreated"])
                            };

                            response.PDFList.Add(pdfItem);
                        }
                    }
                }

                response.IsSuccess = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception: " + ex.Message;
            }
            finally
            {
                if (_sqlConnection.State == ConnectionState.Open)
                {
                    _sqlConnection.Close();
                }
            }

            return response;
        }


    }
}
