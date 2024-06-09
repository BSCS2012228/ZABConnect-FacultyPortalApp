import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import API_BASE_URL from '../apiConfig';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the logout icon

const Dashboard = ({ route }) => {
  const { firstName, lastName, userId, rolDegProCouList } = route.params || {};
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [courseInformation, setCourseInformation] = useState([]);

  useEffect(() => {
    const fetchCourseInformation = async () => {
      try {
        const response = await fetch(API_BASE_URL+'/api/FacultyApplication/GetCourseInformation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, rolDegProCouList }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course information');
        }

        const data = await response.json();
        if (data.isSuccess) {
          setCourseInformation(data.courseInformationList);
        } else {
          console.error('Course information fetch failed:', data.message);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching course information:', error);
        setIsLoading(false);
      }
    };

    fetchCourseInformation();
  }, [userId, rolDegProCouList]);

  const renderCourseButton = (courseInfo) => (
    <TouchableOpacity
      style={styles.courseButton}
      key={courseInfo.courseID+courseInfo.semesterSectionName}
      onPress={() => handleCourseButtonPress(courseInfo)}
    >
      <Text style={styles.courseButtonText}>{courseInfo.courseName}</Text>
      <Text style={styles.courseButtonText}>{courseInfo.programName}</Text>
      <Text style={styles.courseButtonText}>{courseInfo.semesterNo} {courseInfo.semesterSectionName}</Text>
    </TouchableOpacity>
  );

  const handleCourseButtonPress = (courseInfo) => {
    navigation.navigate('TabNavigator', { loginParams: userId, courseInfo, firstName, lastName, rolDegProCouList });
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" userId={userId} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName}/>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome, {firstName} {lastName}</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : courseInformation.length === 0 ? (
            <Text style={styles.noCoursesText}>No Courses Found for this Semester</Text>
          ) : (
            courseInformation.map(renderCourseButton)
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.red} />
      </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  courseButton: {
    backgroundColor: COLORS.blue,
    padding: 20,
    marginBottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
  },
  courseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  noCoursesText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.black,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default Dashboard;
