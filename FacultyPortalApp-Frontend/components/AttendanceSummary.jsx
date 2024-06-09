import React, { useState, useEffect } from 'react';
import { BarChart } from 'react-native-chart-kit';
import { View, Dimensions, ActivityIndicator, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import API_BASE_URL from '../apiConfig';

const AttendanceSummary = ({ courseInfo, loginParams }) => {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    fetch(API_BASE_URL+'/api/FacultyApplication/GetLectureAttendanceSummary', {
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
        setAttendanceData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {attendanceData ? (
        <View
        style={{
          alignSelf: 'center',
          overflow: 'hidden',
          paddingRight:19,
        }}
      >
          <BarChart
            data={{
              labels: Object.keys(attendanceData.lectureAttendanceCounts),
              datasets: [
                {
                  data: Object.values(attendanceData.lectureAttendanceCounts),
                  colors: [
                    (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width - RFValue(50)}
            height={RFValue(200)}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={10}
            chartConfig={{
              backgroundColor: COLORS.blue,
              backgroundGradientFrom: COLORS.blue,
              backgroundGradientTo: COLORS.blue,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: RFValue(10),
              },
              barPercentage: 0.3,
              group: {
                from: 0,
                space: 3,
              },
            }}
            style={{
              marginVertical: RFValue(10),
              borderRadius: RFValue(10),
            }}
            withInnerLines={false}
            withHorizontalLabels={true}
            fromZero={true}
            bezier
            bezierSteps={50}
            animate={{
              duration: 500,
              easing: 'linear',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: RFValue(16),
              marginBottom: RFValue(10),
              color: 'white',
              fontWeight:'bold',
            }}
          >
            Total Students: {attendanceData.totalStudentsInCourse}
          </Text>
        </View>
      ) : (
        <ActivityIndicator size="large" color={COLORS.blue} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    elevation:7,
  },
});
export default AttendanceSummary;
