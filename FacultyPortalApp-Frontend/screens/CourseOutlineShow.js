import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { RFValue } from 'react-native-responsive-fontsize';

const CourseOutlineShow = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params || {};
  const [courseOutline, setCourseOutline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    summary: '',
    courseLectureOutline: '',
    classTiming: '',
    session: '',
    consultationTime: '',
    emailAddress: '',
    contactNo: '',
    learningOutcomes: '',
    learningStrategies: '',
    classHour: '',
    labHour: '',
    courseDescription: '',
    courseObjectives: '',
    classStartTime: '',
    classEndTime: '',
  });

  useEffect(() => {
    fetchCourseOutline();
  }, []);

  const fetchCourseOutline = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/FacCourseOutlineShow', {
        UserId: loginParams,
        SemesterId: courseInfo.semesterID,
        SemesterSectionId: courseInfo.semesterSectionID,
        CourseId: courseInfo.courseID,
      });

      if (response.data.isSuccess) {
        setCourseOutline(response.data);
      } else {
        console.error('Error fetching course outline:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching course outline:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const formValues = Object.values(formData);
    return formValues.every(value => value.trim() !== ''); // Check if all values are not empty after trimming whitespace
  };

  const handleInsertButtonClick = () => {
    setIsDialogVisible(true);
  };

  const handleInsertCourseOutline = async () => {
    if (!isFormValid()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/InsertFacCourseOutline', {
        CreatedBy: loginParams,
        ProcessId: 1,
        CampusId: 100,
        RequestTypeId: 1,
        OfferedCourseId: courseInfo.courseID,
        SemesterId: courseInfo.semesterID,
        SemesterSectionId: courseInfo.semesterSectionID,
        ...formData,
      });

      if (response.data.isSuccess) {
        console.log('Course outline inserted successfully');
      } else {
        console.error('Error inserting course outline:', response.data.message);
      }
    } catch (error) {
      console.error('Error inserting course outline:', error.message);
    } finally {
      setIsDialogVisible(false);
    }
  };

  const handleChangeText = (key, value) => {
    setFormData(prevState => ({ ...prevState, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Course Outline" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : courseOutline?.isSuccess ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.greetingText}>
              Course Name: {courseInfo.courseName}
              {'\n'}
              Program Name: {courseInfo.programName}
              {'\n'}
              Section: {courseInfo.semesterSectionName}
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleInsertButtonClick}>
              <Text style={styles.uploadButtonText}>Insert Course Outline</Text>
            </TouchableOpacity>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Course Outline Summary</Text>
              <Text style={styles.text}>{courseOutline.courseDescription}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Course Essentials</Text>
              <Text style={styles.text}>Class End Time: {courseOutline.classEndTime}</Text>
              <Text style={styles.text}>Class Start Time: {courseOutline.classStartTime}</Text>
              <Text style={styles.text}>Room No: {courseOutline.classTiming}</Text>
              <Text style={styles.text}>Consultation Time: {courseOutline.consultationTime}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Course Objectives</Text>
              <Text style={styles.text}>{courseOutline.courseObjectives}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Course Learning Outcomes</Text>
              <Text style={styles.text}>{courseOutline.learningOutcomes}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Teaching & Learning Method</Text>
              <Text style={styles.text}>{courseOutline.teachingLearningMethod}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Class Conduct</Text>
              <Text style={styles.text}>{courseOutline.classConduct}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Text style={styles.text}>Faculty: {courseOutline.facultyFullName}</Text>
              <Text style={styles.text}>Email: {courseOutline.emailAddress}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Lectures</Text>
              {courseOutline.lectures.map((item) => (
                <View key={item.lectureNo} style={styles.lectureItem}>
                  <Text>Lecture No: {item.lectureNo}</Text>
                  <Text>Lecture Detail: {item.lectureDetail}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.errorText}>Error: {courseOutline?.message}</Text>
        )}
      </View>
      {/* Modal for inserting course outline */}
      <Modal animationType="slide" transparent={true} visible={isDialogVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Summary"
                onChangeText={(text) => handleChangeText('summary', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Course Lecture Outline"
                onChangeText={(text) => handleChangeText('courseLectureOutline', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Class Timing"
                onChangeText={(text) => handleChangeText('classTiming', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Session"
                onChangeText={(text) => handleChangeText('session', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Consultation Time"
                onChangeText={(text) => handleChangeText('consultationTime', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                onChangeText={(text) => handleChangeText('emailAddress', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact No"
                onChangeText={(text) => handleChangeText('contactNo', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Learning Outcomes"
                onChangeText={(text) => handleChangeText('learningOutcomes', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Learning Strategies"
                onChangeText={(text) => handleChangeText('learningStrategies', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Class Hour"
                onChangeText={(text) => handleChangeText('classHour', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Lab Hour"
                onChangeText={(text) => handleChangeText('labHour', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Course Description"
                onChangeText={(text) => handleChangeText('courseDescription', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Course Objectives"
                onChangeText={(text) => handleChangeText('courseObjectives', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Class Start Time"
                onChangeText={(text) => handleChangeText('classStartTime', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Class End Time"
                onChangeText={(text) => handleChangeText('classEndTime', text)}
              />
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.CloseButton} onPress={() => setIsDialogVisible(false)}>
                <Text style={styles.CloseButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.insertButton} onPress={handleInsertCourseOutline}>
                <Text style={styles.insertButtonText}>Insert Course Outline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  uploadButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
  },
  uploadButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  scrollView: {
    marginBottom: 50,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  greetingText: {
    fontSize: RFValue(19),
    fontWeight: '300',
    textAlign: 'left',
    marginBottom: RFValue(10),
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  lectureItem: {
    backgroundColor: COLORS.lightGray,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalScroll: {
    flexGrow: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  CloseButton: {
    backgroundColor: COLORS.red,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
    flex: 1,
  },
  CloseButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  insertButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
    flex: 1,
    marginLeft: 5,
  },
  insertButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default CourseOutlineShow;
