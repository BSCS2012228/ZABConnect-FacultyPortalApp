import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import axios from 'axios';
import LectureInsertDialog from './LectureInsertDialog'; 
import API_BASE_URL from '../apiConfig';
import { RFValue } from 'react-native-responsive-fontsize'; 

const { width, height } = Dimensions.get('window');

const LectureProgressShow = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params || {};
  const [lectureProgress, setLectureProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [lastLectureNo, setLastLectureNo] = useState(null);

  useEffect(() => {
    getLectureProgress();
  }, []);

  const getLectureProgress = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/LectureProgressShow', {
        SemesterId: courseInfo.semesterID,
        SemesterSectionId: courseInfo.semesterSectionID,
        UserId: loginParams,
        CourseId: courseInfo.courseID,
      });

      if (response.data.isSuccess) {
        setLectureProgress(response.data);
        const lastLecture = response.data.lectureDetails[response.data.lectureDetails.length - 1];
        setLastLectureNo(lastLecture?.lectureNo);
      } else {
        console.error('Error fetching lecture progress:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching lecture progress:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertButtonClick = () => {
    setIsDialogVisible(true);
  };

  const tableHead = ['Lecture No', 'Date', 'Time', 'Status', 'Topics Covered', 'Class Activity', 'Attendance Marked'];
  const columnWidths = [80, 100, 150, 100, 150, 150, 150];

  const renderRow = (rowData, index) => (
    <View key={index} style={[styles.row, index % 2 && { backgroundColor: COLORS.lightGrey }]}>
      {rowData.map((cellData, cellIndex) => (
        <Text key={cellIndex} style={[styles.cell, { width: columnWidths[cellIndex] }]}>
          {cellData}
        </Text>
      ))}
    </View>
  );

  const tableData = lectureProgress?.lectureDetails.map(item => [
    item.lectureNo,
    item.lectureDate,
    `${item.classStartTime} - ${item.classEndTime}`,
    item.classStatus,
    item.topicsCovered,
    item.classActivity,
    item.isAttendanceMarked ? 'Yes' : 'No'
  ]) || [];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lecture Progress" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : lectureProgress?.isSuccess ? (
          <>
            <Text style={styles.greetingText}>
              Course Name: {courseInfo.courseName}
              {'\n'}
              Program Name: {courseInfo.programName}
              {'\n'}
              Section: {courseInfo.semesterSectionName}
            </Text>
            <TouchableOpacity style={styles.insertButton} onPress={handleInsertButtonClick}>
              <Text style={styles.insertButtonText}>Insert Lecture Progress</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
              <View>
                <View style={[styles.header, styles.rowBorder]}>
                  {tableHead.map((headItem, index) => (
                    <Text key={index} style={[styles.headerText, { width: columnWidths[index] }]}>
                      {headItem}
                    </Text>
                  ))}
                </View>
                <ScrollView style={styles.dataWrapper} showsVerticalScrollIndicator = {false}>
                  {tableData.map((rowData, index) => (
                    <View key={index} style={[styles.row, styles.rowBorder, index % 2 && { backgroundColor: COLORS.lightGrey }]}>
                      {rowData.map((cellData, cellIndex) => (
                        <Text key={cellIndex} style={[styles.cell, { width: columnWidths[cellIndex] }]}>
                          {cellData}
                        </Text>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </>
        ) : (
          <Text>Error: {lectureProgress?.message}</Text>
        )}

        <LectureInsertDialog
          isVisible={isDialogVisible}
          onClose={() => setIsDialogVisible(false)}
          refreshData={getLectureProgress}
          loginParams={loginParams}
          courseInfo={courseInfo}
          lastLectureNumber={lastLectureNo}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    marginBottom: 100,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    height: RFValue(50),
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.white,
    padding: RFValue(8),
  },
  row: {
    flexDirection: 'row',
    height: RFValue(40),
    backgroundColor: COLORS.white,
  },
  rowBorder: {
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  cell: {
    textAlign: 'center',
    fontWeight: '200',
    color: COLORS.black,
    padding: RFValue(10),
  },
  dataWrapper: {
    marginTop: -1,
  },
  greetingText: {
    fontSize: RFValue(19),
    fontWeight: '300',
    textAlign: 'left',
    marginBottom: RFValue(10),
  },
  insertButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
  },
  insertButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default LectureProgressShow;
