import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import COLORS from '../constants/colors';
import API_BASE_URL from '../apiConfig';

const LectureProgressBar = ({ courseInfo, loginParams }) => {
  const [progress, setProgress] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE_URL+'/api/FacultyApplication/LectureProgressShow', {
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
    })
      .then((response) => response.json())
      .then((data) => {
        
        const totalLectures = data.totalLectureCount; 
        const lecturesDone = data.totalLectureCount; 
        const calculatedProgress = (lecturesDone / totalLectures) * 100;

        
        setProgress(calculatedProgress);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
  }, [courseInfo, loginParams]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressContent}>
            <Text style={styles.progressText}>{`${progress.toFixed(2)}%`}</Text>
            <ProgressBar
              progress={progress / 100}
              style={styles.progressBar}
              color={COLORS.blue}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    elevation:7,
    paddingTop:15,
  },
  progressBarContainer: {
    width: screenWidth * 0.9,
  },
  progressContent: {
    paddingLeft: 20,
    paddingRight:20,
    paddingBottom: 30,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 20,
    color: COLORS.blue,
  },
  progressBar: {
    height: 12,
    borderRadius: 15,
  },
});

export default LectureProgressBar;
