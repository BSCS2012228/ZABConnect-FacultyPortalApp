import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import COLORS from '../constants/colors';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';

const CourseOutlineMarksDistributionScreen = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params || {};
  const [marksDistribution, setMarksDistribution] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMark, setSelectedMark] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [recapData, setRecapData] = useState({});
 

  useEffect(() => {
    fetchMarksDistribution();
  }, []);

  const fetchMarksDistribution = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetCourseOutlineMarksDistribution', {
        userId: loginParams,
        semesterId: courseInfo.semesterID,
        sectionId: courseInfo.semesterSectionID,
        courseId: courseInfo.courseID,
      });
      if (response.data.isSuccess) {
        setMarksDistribution(response.data.marksDistribution);
        console.log(response.data.marksDistribution);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecapData = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetFacStdRecapSheetShowRecap', {
        UserId: loginParams,
        SemesterId: courseInfo.semesterID,
        SemesterSectionId: courseInfo.semesterSectionID,
        CourseId: courseInfo.courseID,
        MarksHeadId: selectedMark.marksHeadId,
        SerialNo: selectedFrequency,
      });

      if (response.data.isSuccess) {
        setRecapData(response.data);
        console.log(response.data);
        setModalVisible(true);
      } else {
        console.error('API request failed:', response.data.message);
        setErrorMessage('Failed to retrieve data. Please try again.');
      }
    } catch (error) {
      console.error('API request failed:', error.message);
      setErrorMessage('Failed to retrieve data. Please try again.');
    }
  };

  const handleMarkSelection = (mark) => {
    setSelectedMark(mark);
    setSelectedFrequency(null);
    setErrorMessage('');
  };

  const handleFrequencySelection = (frequency) => {
    setSelectedFrequency(frequency);
  };

  const handleProceed = () => {
    if (selectedMark && selectedFrequency) {
      fetchRecapData();
      setErrorMessage('');
    } else {
      setErrorMessage('Please select frequency number');
    }
  };

  const handleInsertMarks = async () => {
    try {
      const studentsToInsert = recapData.studentInfo.filter(student => {
        const enteredMarks = parseInt(student.enteredMarks);
        return enteredMarks >= 0 && enteredMarks <= selectedMark.totalMarks;
      });
      
      if (studentsToInsert.length > 0) {
        const requestData = {
          userId: loginParams,
          students: studentsToInsert.map(student => ({
            stdMainId: student.stdMainId,
            marksObtained: student.enteredMarks,
          })),
          offeredCoursesCourseId: courseInfo.courseID,
          marksHeadId: selectedMark.marksHeadId,
          semesterId: courseInfo.semesterID,
          semesterSectionId: courseInfo.semesterSectionID,
          marksTypeSerialNo: selectedFrequency,
          totalMarks: selectedMark.totalMarks,
          createdBy: loginParams, 
          modifiedBy: loginParams, 
          showResult: '1', 
        };
  
        const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/FacStdRecapSheetInsert', requestData);
  
        if (response.data.isSuccess) {
          console.log('Marks inserted successfully');
          setModalVisible(false);
        } else {
          console.error('Error inserting marks:', response.data.message);
        }
      } else {
        alert('You have to enter Students Marks Less then the Total Marks or you dont have any marks to enter.');
      }
    } catch (error) {
      console.error('Error inserting marks:', error.message);
    }
  };
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Recapsheet" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        <Text style={styles.greetingText}>
          Course Name: {courseInfo.courseName}
          {'\n'}
          Program Name: {courseInfo.programName}
          {'\n'}
          Section: {courseInfo.semesterSectionName}
        </Text>
      
        <FlatList
          data={marksDistribution}
          keyExtractor={(item) => item.marksHeadId.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMarkSelection(item)} style={[styles.markHeadContainer, selectedMark === item ? styles.selectedMark : null]}>
              <Text style={styles.markHeadTitle}>{item.marksHeadDescription}</Text>
              <Text>Total Frequency: {item.totalFrequency}</Text>
              <Text>Total Exempted: {item.totalExempted}</Text>
              <Text>Total Marks: {item.totalMarks}</Text>
              {selectedMark === item && (
                <View style={styles.frequencyContainer}>
                  {Array.from({ length: item.totalFrequency }, (_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleFrequencySelection(index + 1)}
                      style={[
                        styles.frequencyBox,
                        selectedFrequency === index + 1 ? styles.selectedFrequencyBox : null
                      ]}
                    >
                      <Text>{index + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
        {selectedMark && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.insertButton} onPress={handleProceed}>
              <Text style={styles.insertButtonText}>View Recapsheet</Text>
            </TouchableOpacity>
          </View>
        )}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Registration No</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Name</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Marks Obtained</Text>
            </View>
            <FlatList
              data={recapData.studentInfo}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.registrationNo}</Text>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  {item.marksObtained === 'Not Entered' ? (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter"
                      onChangeText={(text) => item.enteredMarks = text}
                      keyboardType='number-pad'
                    />
                  ) : (
                    <Text style={styles.tableCell}>{item.marksObtained}</Text>
                  )}
                </View>
              )}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.CloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.CloseButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.insertButton} onPress={handleInsertMarks}>
                <Text style={styles.insertButtonText}>Insert Marks</Text>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(78)
  },
  markHeadContainer: {
    padding: RFValue(20),
    backgroundColor: COLORS.white,
    margin: RFValue(10),
    borderRadius: RFValue(20),
    elevation: RFValue(7),
  },
  selectedMark: {
    borderColor: COLORS.blue
  },
  markHeadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewRecapsheetButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  viewRecapsheetButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greetingText: {
    fontSize: RFValue(19),
    fontWeight: '300',
    textAlign: 'left',
    marginBottom: RFValue(10),
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  frequencyBox: {
    borderWidth: 3,
    borderColor: COLORS.grey,
    padding: 10,
    borderRadius: 8,
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
  selectedFrequencyBox: {
    borderColor: COLORS.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: RFValue(18),
    borderRadius: RFValue(10),
    elevation: RFValue(5),
    width: '95%',
    maxHeight: '80%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: RFValue(1),
    borderColor: COLORS.grey,
    paddingBottom: RFValue(10),
    marginBottom: RFValue(10),
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: RFValue(12),
    color: COLORS.darkGray,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: RFValue(1),
    borderColor: COLORS.lightGray,
    paddingVertical: RFValue(10),
  },
  tableCell: {
    flex: 1,
    fontSize: RFValue(10),
    color: COLORS.darkGray,
    textAlign: 'center',
    
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: RFValue(5), // Decrease the border radius to make it smaller
    paddingHorizontal: RFValue(3), // Adjust the horizontal padding to make it smaller
    paddingVertical: RFValue(3), // Adjust the vertical padding to make it smaller
    fontSize: RFValue(10), // Ad
    width: '50%', 
  },
});

export default CourseOutlineMarksDistributionScreen;
