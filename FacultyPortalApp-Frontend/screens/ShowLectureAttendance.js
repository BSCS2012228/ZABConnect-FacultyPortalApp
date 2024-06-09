import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import API_BASE_URL from '../apiConfig';
import { RFValue } from 'react-native-responsive-fontsize';
import LectureSelectionDialog from '../components/LectureSelectionDialog';

const ShowLectureAttendance = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params || {};
  const [lectureData, setLectureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [lectureOptions, setLectureOptions] = useState([]);
  const [selectedLectureNumber, setSelectedLectureNumber] = useState(null);

  const handleButtonClick = () => {
    fetchUnmarkedLectureNumbers();
  };

  const fetchUnmarkedLectureNumbers = async () => {
    try {
      const response = await fetch(API_BASE_URL+'/api/FacultyApplication/GetUnmarkedLectureNumbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SemesterId: courseInfo.semesterID,
          SemesterSectionId: courseInfo.semesterSectionID,
          UserId: loginParams,
          CourseId: courseInfo.courseID,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setLectureOptions(data.unmarkedLectureNumbers || []);
        setIsDialogVisible(true);
      } else {
     
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching unmarked lecture numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSelect = (lectureNumber) => {
    setSelectedLectureNumber(lectureNumber);
  };

  const handleDialogClose = () => {
    setIsDialogVisible(false);
  };

  const handleDialogProceed = () => {
  
    console.log('Selected Lecture Number:', selectedLectureNumber);


    setIsDialogVisible(false);
  };



  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(API_BASE_URL+'/api/FacultyApplication/GetCourseLectureAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SemesterId: courseInfo.semesterID,
          SemesterSectionId: courseInfo.semesterSectionID,
          UserId: loginParams,
          CourseId: courseInfo.courseID,
        }),
      });

      const data = await response.json();
      console.log(data);
      setLectureData(data.lectures);
    } catch (error) {
      console.error('Error fetching lecture attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const openLectureDetails = (lecture) => {
    setSelectedLecture(lecture);
    setModalVisible(true);
  };

  const closeLectureDetails = () => {
    setSelectedLecture(null);
    setModalVisible(false);
  };

  const renderLectureItem = ({ item }) => (
    <TouchableOpacity style={styles.lectureContainer} onPress={() => openLectureDetails(item)}>
      <Text style={styles.lectureNumber}>Lecture Number: {item.lectureNo}</Text>
    </TouchableOpacity>
  );

  const renderStudentAttendance = ({ item }) => (
    <View style={styles.studentAttendanceBlock}>
      <Text style={styles.studentText}>Student Name: {item.studentName}</Text>
      <Text>Registration Number: {item.regNo}</Text>
      <Text>Attendance: {item.attendance}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Lecture Attendance"
        userId={loginParams}
        rolDegProCouList={rolDegProCouList}
        firstName={firstName}
        lastName={lastName}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.greetingText}>
          Course Name: {courseInfo.courseName}
          {'\n'}
          Program Name: {courseInfo.programName}
          {'\n'}
          Section: {courseInfo.semesterSectionName}
        </Text>
        <TouchableOpacity style={styles.AttendanceButton} onPress={handleButtonClick}>
              <Text style={styles.AttendanceButtonText}>Mark Attendance</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : (
          <FlatList
            data={lectureData}
            keyExtractor={(lecture) => lecture.lectureNo.toString()}
            renderItem={renderLectureItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeLectureDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            {selectedLecture && (
              <>
                <Text style={styles.modalTitle}>Lecture Number: {selectedLecture.lectureNo}</Text>
                <FlatList
                  data={selectedLecture.studentAttendances}
                  keyExtractor={(student) => student.regNo}
                  renderItem={renderStudentAttendance}
                  showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity style={styles.closeButton} onPress={closeLectureDetails}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      </View>
      <LectureSelectionDialog
        isVisible={isDialogVisible}
        lectureNumbers={lectureOptions}
        onSelect={handleDialogSelect}
        onClose={handleDialogClose}
        onProceed={handleDialogProceed}
        courseInfo = {courseInfo}
        loginParams = {loginParams}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    
  },
  content: {
    flex: 1,
  },
  greetingText: {
    fontSize: RFValue(19),
    fontWeight: '300',
    textAlign: 'left',
    marginBottom: 10,
  },
  lectureContainer: {
    padding: RFValue(20),
    backgroundColor: COLORS.white,
    margin: RFValue(10),
    borderRadius: RFValue(20),
    elevation: RFValue(7),
  },
  lectureNumber: {
    fontSize: 18,
    fontWeight: 'medium',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(88),
  },
  studentAttendanceBlock: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 8,
    marginBottom: 10,
  },
  studentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: COLORS.red,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
  },
  closeButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  AttendanceButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: RFValue(20),
    alignItems: 'center',
    marginBottom: 10,
  },
  AttendanceButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShowLectureAttendance;
