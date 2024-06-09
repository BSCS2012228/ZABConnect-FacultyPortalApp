import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';
import COLORS from '../constants/colors';
import API_BASE_URL from '../apiConfig';

const programs = [
  { name: 'BABS Program', schedule: 'BABS-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BBA Program', schedule: 'BBA-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BEd Program', schedule: 'BEd-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BEME', schedule: 'BEME-Final-Exam-Schedule-Spring-2024.xls' },
  { name: 'BS Biosciences Program', schedule: 'BS-Biosciences-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BS Biotechnology Program', schedule: 'BS-Biotechnology-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BS Entrepreneurship Program', schedule: 'BS-Entrepreneurship-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BSAF Program', schedule: 'BSAF-Program-Final-Exam-Schedule-for-Spring-2024..xlsx' },
  { name: 'BSAI Program', schedule: 'BSAI-Program-Final-Exam-Schedule-for-Spring-2024.xls' },
  { name: 'BSCS (1st & 2nd Years Semester) Program', schedule: 'BSCS-(1st-&-2nd-Years-Semester)-Program-Classes-Schedule-for-Spring-2024.xls' },
  { name: 'BSCS (3rd & 4th Years Semester) Program', schedule: 'BSCS-(3rd-&-4th-Years-Semester)-Program-Classes-Schedule-for-Spring-2024.xlsx' },
  { name: 'BSEP Program', schedule: 'BSEP-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BSMS Program', schedule: 'BSMS-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BSPH Program', schedule: 'BSPH-Program-Final-Exam-Schedule-for-Spring-2024.xls' },
  { name: 'BSSE Program', schedule: 'BSSE-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'BSSS Program', schedule: 'BSSS Program Final Exam Schedule for Spring 2024' },
  { name: 'EMBA Program', schedule: 'EMBA-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'MBA Day 36 Program', schedule: 'MBA-Day-36-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'MBA Evening 36 Program', schedule: 'MBA-Evening-36-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'MBA Evening 72 Program', schedule: 'MBA-Evening-72-Program-Final-Exam-for-Spring-2024.xlsx' },
  { name: 'MPM & MSPM Program', schedule: 'MPM-&-MSPM-Program-Final-Exam-Scheduled-for-Spring-2024.xlsx' },
  { name: 'MS Public Health Program', schedule: 'MS-Public-Health-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'MS-BIO, MS-BIOTECH & PhD BIO Sciences Program', schedule: 'MS-BIO,-MS-BIOTECH-&-PhD-BIO-Sciences-Program-Schedule-Spring-2024.xlsx' },
  { name: 'MS-Mechatronics Program', schedule: 'MS-Mechatronics-Program-Final-Exam-Schedule-for-Spring-2024.xls' },
  { name: 'MSCS-PhDCS & MS (Cyber-Security) Program', schedule: 'MSCS-PhDCS-&-MS-(Cyber-Security)-Program-Spring-2023.xlsx' },
  { name: 'MSDS Program', schedule: 'MSDS-Program-Final-Exam-Scheduled-for-Spring-2024.xlsx' },
  { name: 'MSELM Program', schedule: 'MSELM-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
  { name: 'MSMS and PhDMS Program', schedule: 'MSMS-and-PhDMS-Program-Final-Exam-Schedule-for-Spring-2024..xlsx' },
  { name: 'MSSS PhDSS Program', schedule: 'MSSS-PhDSS-Program-Final-Exam-Schedule-for-Spring-2024.xlsx' },
];

const ExamScheduleScreen = ({ route }) => {
  const { loginParams, rolDegProCouList, firstName, lastName } = route.params;

  const handleDownloadPress = async (schedule) => {
    try {
      // Replace this with your actual file download URL
      const fileUrl = API_BASE_URL+'/api/FacultyApplication/Download?fileName=' + encodeURIComponent(schedule);
      await Linking.openURL(fileUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Exam Schedules" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        <FlatList
          data={programs}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleDownloadPress(item.schedule)}>
              <Text style={styles.titleText}>{item.name}</Text>
              <Text style={styles.subTitleText}>{item.schedule}</Text>
            </TouchableOpacity>
          )}
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
  },
});

export default ExamScheduleScreen;
