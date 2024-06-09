import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const OfferedCoursesScreen = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOfferedCourses();
  }, []);

  const fetchOfferedCourses = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/ViewOfferedCourses', {
        SemesterYear: 2022, // Adjust as needed
        SemesterType: 1, // Adjust as needed
      });

      if (response.data.isSuccess) {
        setPrograms(response.data.programs);
      } else {
        console.error('Error fetching offered courses:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching offered courses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramPress = (program) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Offered Courses" />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {programs.map((program, index) => (
              <TouchableOpacity
                key={index}
                style={styles.programButton}
                onPress={() => handleProgramPress(program)}
              >
                <Text style={styles.programButtonText}>{program.programName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProgram ? selectedProgram.programName : ''}</Text>
              <ScrollView style={styles.modalScrollView}>
                {selectedProgram &&
                  selectedProgram.courses.map((course, index) => (
                    <View key={index} style={styles.modalCourseContainer}>
                      <Text style={styles.courseName}>{course.courseName}</Text>
                      <Text style={styles.facultyName}>Faculty: {course.facultyName}</Text>
                      <Text style={styles.sectionName}>Section: {course.sectionName}</Text>
                      {/* Add more details if needed */}
                    </View>
                  ))}
              </ScrollView>
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  scrollView: {
    marginBottom: 70,
  },
  programButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  programButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
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
    width: '90%', // Adjust the width as needed
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 500, // Adjust the max height as needed
  },
  modalCourseContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  facultyName: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionName: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default OfferedCoursesScreen;
