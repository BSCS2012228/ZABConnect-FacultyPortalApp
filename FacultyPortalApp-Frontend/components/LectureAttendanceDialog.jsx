import React, { useState } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import API_BASE_URL from '../apiConfig';
import { RFValue } from 'react-native-responsive-fontsize';

const AttendanceButton = ({ status, onPress }) => {
  let buttonColor = COLORS.blue; 

  switch (status) {
    case 'Present':
      buttonColor = COLORS.green;
      break;
    case 'Leave':
      buttonColor = COLORS.orange;
      break;
    case 'Absent':
      buttonColor = COLORS.red;
      break;
    case 'Late':
      buttonColor = COLORS.charcoal;
      break;
    case 'Excused':
      buttonColor = COLORS.grey;
      break; 
    case 'Exempted':
      buttonColor = COLORS.blue;
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      style={[styles.attendanceButton, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={styles.attendanceButtonText}>{status}</Text>
    </TouchableOpacity>
  );
};

const LectureAttendanceDialog = ({ isVisible, studentList, onClose, courseInfo, loginParams, lectureNumber }) => {
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const toggleAttendanceStatus = (regNo) => {
    setAttendanceStatus((prevStatus) => {
      const currentStatus = prevStatus[regNo] || 'Present';
      const newStatus =
        currentStatus === 'Present'
          ? 'Leave'
          : currentStatus === 'Leave'
          ? 'Absent'
          : currentStatus === 'Absent'
          ? 'Late'
          : currentStatus === 'Late'
          ? 'Excused'
          : currentStatus === 'Excused'
          ? 'Exempted'
          : 'Present';

      return { ...prevStatus, [regNo]: newStatus };
    });
  };

  const getStatusNumber = (status) => {
    switch (status) {
      case 'Present':
        return 1;
      case 'Leave':
        return 2;
      case 'Absent':
        return 3;
      case 'Late':
        return 4;
      case 'Excused':
        return 5;
      case 'Exempted':
        return 6;
      default:
        return 1; // Default to Present if status is not recognized
    }
  };

  const markAttendance = async () => {
    try {
      const formattedAttendance = studentList.map((student) => {
        const statusNumber = getStatusNumber(attendanceStatus[student.regNo]);
        return `${student.stdMainId},${statusNumber},false`;
      }).join(';') + ';';
      console.log(lectureNumber);
      const response = await fetch(API_BASE_URL+'/api/FacultyApplication/InsertLectureAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: loginParams,
          courseLectureAttendanceDate: new Date().toISOString(),
          courseLectureAttendanceLectureNo: lectureNumber, 
          offeredCoursesCourseId: courseInfo.courseID, 
          userId: loginParams,
          semesterId: courseInfo.semesterID,
          semesterSectionId: courseInfo.semesterSectionID,
          lectureAttendance: formattedAttendance,
        }),
      });

      const data = await response.json();
      if (data.isSuccess) {
        alert('Attendance marked successfully');
        
        // Optionally, you can update your UI or show a success message here
      } else {
        console.error('Failed to mark attendance:', data.message);
        // Optionally, you can handle the failure case here
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      // Optionally, you can handle the error case here
    }
  };

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentBox}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.registrationNumber}>Registration Number: {item.regNo}</Text>
      </View>
      <AttendanceButton
        status={attendanceStatus[item.regNo] || 'Present'}
        onPress={() => toggleAttendanceStatus(item.regNo)}
      />
    </View>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.dialogBox}>
          <Text style={styles.modalTitle}>Make Lecture Attendance</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={studentList}
              keyExtractor={(item) => item.regNo}
              renderItem={renderStudentItem}
              contentContainerStyle={styles.flatListContainer}
              showsVerticalScrollIndicator= {false}
            />
          </View>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButtonClose} onPress={onClose}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonMarkAttendance} onPress={markAttendance}>
              <Text style={styles.modalButtonText}>Mark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogBox: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    overflow: 'hidden',
    height: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    width: '95%',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  studentBox: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.grey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
    marginRight: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.blue,
  },
  registrationNumber: {
    fontSize: 16,
    color: COLORS.black,
  },
  attendanceButton: {
    width: 70,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonClose: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginRight:4,
  },
  modalButtonMarkAttendance: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginRight:4,
    marginLeft: 5,
  },
  modalButtonText: {
    color: 'white',
  },
});

export default LectureAttendanceDialog;
