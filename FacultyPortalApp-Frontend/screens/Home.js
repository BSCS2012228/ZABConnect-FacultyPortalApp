import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import AttendanceSummary from '../components/AttendanceSummary';
import { RFValue } from 'react-native-responsive-fontsize'; 
import { useNavigation } from '@react-navigation/native';
import LectureProgressBar from '../components/LectureProgressBar';
import ReminderPopup from '../components/ReminderPopup';

const Home = ({ route }) => {
  const { courseInfo, loginParams, rolDegProCouList, firstName, lastName } = route.params || {};
  const navigation = useNavigation(); 
  const [reminderVisible, setReminderVisible] = useState(true);

  const handleSeeMorePress = () => {   
    navigation.navigate('Attendance'); 
  };

  const handleSeeMorePressLecture = () => {
    navigation.navigate('LecProgress'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Home"
        userId={loginParams}
        rolDegProCouList={rolDegProCouList}
        firstName={firstName}
        lastName={lastName}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.greetingText}>
            Course Name : {courseInfo.courseName}
            {'\n'}
            Program Name : {courseInfo.programName}
            {'\n'}
            Section : {courseInfo.semesterSectionName}
          </Text>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleLeft}>Lecture Progress</Text>
            <TouchableOpacity onPress={handleSeeMorePressLecture}>
              <Text style={styles.sectionTitleRight}>See More</Text>
            </TouchableOpacity>
          </View>
          <LectureProgressBar loginParams={loginParams} courseInfo={courseInfo} />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleLeft}>Attendance Summary</Text>
            <TouchableOpacity onPress={handleSeeMorePress}>
              <Text style={styles.sectionTitleRight}>See More</Text>
            </TouchableOpacity>
          </View>
          <View>
            <AttendanceSummary loginParams={loginParams} courseInfo={courseInfo} />
          </View>
        </View>
      </ScrollView>
      <ReminderPopup visible={reminderVisible} loginParams={loginParams} onClose={() => setReminderVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: RFValue(70), 
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    marginBottom: RFValue(20), 
    paddingHorizontal: 16, 
  },
  greetingText: {
    fontSize: RFValue(19), 
    fontWeight: 'bold',
    textAlign: 'left',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 20,
  },
  sectionTitleLeft: {
    fontSize: RFValue(19),
    fontWeight: 'bold',
  },
  sectionTitleRight: {
    fontSize: RFValue(13), 
    fontWeight: 'bold',
    marginTop: RFValue(10), 
  },
});

export default Home;
