import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import LectureAttendanceDialog from './LectureAttendanceDialog';
import API_BASE_URL from '../apiConfig';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const LectureSelectionDialog = ({ isVisible, lectureNumbers, onSelect, onClose, courseInfo, loginParams }) => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLectureAttendanceDialogVisible, setLectureAttendanceDialogVisible] = useState(false);
  const [fetchedStudentList, setFetchedStudentList] = useState([]);
  const [isLectureSelected, setIsLectureSelected] = useState(false);
  const scrollY = useSharedValue(0);
  const navigation = useNavigation();

  useEffect(() => {
    setSelectedLecture(null);
    setIsLectureSelected(false);
    if (isVisible) {
      scrollY.value = withSpring(0);
    }
  }, [isVisible]);

  const handleDialogProceed = async () => {
    console.log(selectedLecture)
    try {
      const response = await fetch(API_BASE_URL+'/api/FacultyApplication/GetStudentList', {
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

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setLectureAttendanceDialogVisible(true);
        setFetchedStudentList(data.students || []);
      } else {
        console.error('Error fetching student list:', response.status);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.lectureBox,
        { borderColor: selectedLecture === item ? COLORS.blue : COLORS.grey },
      ]}
      onPress={() => {
        setSelectedLecture(item);
        setIsLectureSelected(true);
        runOnJS(scrollToIndex)(index);
      }}
    >
      <Text style={styles.lectureText}>{item}</Text>
    </TouchableOpacity>
  );

  const scrollToIndex = (index) => {
    scrollY.value = withSpring(index * (height * 0.1));
  };

  const isUnmarkedLectureEmpty = lectureNumbers.length === 0;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.dialogBox}>
          <Text style={styles.modalTitle}>Select Lecture</Text>
          {isUnmarkedLectureEmpty ? (
            <Text style={styles.noAttendanceText}>Attendance has been done for Every Lecture</Text>
          ) : (
            <FlatList
              data={lectureNumbers}
              keyExtractor={(item) => item.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.lectureList}
              numColumns={Math.floor(width / (width * 0.3))}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                scrollY.value = event.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              snapToInterval={height * 0.1}
              decelerationRate="fast"
            />
          )}
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            {!isUnmarkedLectureEmpty && (
              <TouchableOpacity
                style={[styles.modalButtonProceed, { opacity: isLectureSelected ? 1 : 0.5 }]}
                onPress={handleDialogProceed}
                disabled={!isLectureSelected}
              >
                <Text style={styles.modalButtonText}>Proceed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <LectureAttendanceDialog
        isVisible={isLectureAttendanceDialogVisible}
        studentList={fetchedStudentList}
        onClose={() => setLectureAttendanceDialogVisible(false)}
        courseInfo={courseInfo}
        loginParams={loginParams}
        lectureNumber={selectedLecture}
      />
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
    width: '90%',
    maxWidth: 400, 
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lectureList: {
    height: height * 0.4,
  },
  lectureBox: {
    width: width * 0.3,
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  lectureText: {
    fontSize: width * 0.04,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: COLORS.red,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginRight:5,
  },
  modalButtonProceed: {
    flex:1,
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
  },
  modalButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  noAttendanceText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: COLORS.blue,
  },
});

export default LectureSelectionDialog;
