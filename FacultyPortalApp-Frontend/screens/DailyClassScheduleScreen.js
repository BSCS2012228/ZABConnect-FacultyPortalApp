import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';
import COLORS from '../constants/colors';

const DailyClassScheduleScreen = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params;
  const [classScheduleDetails, setClassScheduleDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassScheduleDetails();
  }, []);

  const fetchClassScheduleDetails = async () => {
    const date = new Date();
    const formattedDate = `${"2022"}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetDailyClassSchedule', {
        SemesterYear: 2022,
        SemesterType: 1,
        UserId: loginParams,
        Date: formattedDate,
      });

      if (response.data.isSuccess) {
        setClassScheduleDetails(response.data.classScheduleDetails);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Daily Class Schedule" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : classScheduleDetails.length === 0 ? (
          <Text>No class scheduled today.</Text>
        ) : (
          <FlatList
            data={classScheduleDetails}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.titleText}>{item.classType}</Text>
                <Text style={styles.subTitleText}>{item.courseName}</Text>
                <Text style={styles.subTitleText}>{item.sectionName}</Text>
                <Text style={styles.subTitleText}>{item.facultyName}</Text>
                <Text style={styles.subTitleText}>{item.date}</Text>
                <Text style={styles.subTitleText}>{item.startTime} - {item.endTime}</Text>
                <Text style={styles.subTitleText}>{item.roomLabel} ({item.buildingId})</Text>
                <Text style={styles.subTitleText}>Slot No: {item.slotNo}</Text>
                <Text style={styles.subTitleText}>Class Status ID: {item.classStatusId}</Text>
              </View>
            )}
          />
        )}
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
    padding: 20,
    margin: 2,
    marginBottom: 50,
  },
  item: {
    padding: RFValue(20),
    backgroundColor: COLORS.white,
    margin: RFValue(10),
    borderRadius: RFValue(20),
    elevation: RFValue(7),
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitleText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DailyClassScheduleScreen;
