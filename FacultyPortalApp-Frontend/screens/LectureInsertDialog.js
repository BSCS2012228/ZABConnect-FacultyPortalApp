import React, { useState, useRef } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const LectureInsertDialog = ({ isVisible, onClose, refreshData, loginParams, courseInfo, lastLectureNumber }) => {
  const [lectureDate, setLectureDate] = useState(new Date());
  const [classStartTime, setClassStartTime] = useState('');
  const [classEndTime, setClassEndTime] = useState('');
  const [classStatus, setClassStatus] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [classActivity, setClassActivity] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [validationError, setValidationError] = useState('');
  const scrollViewRef = useRef(null);

  const navigation = useNavigation();

  const handleInsert = async () => {
    if (!lectureDate || !classStartTime || !classEndTime || !classStatus || !topicsCovered || !classActivity) {
      setValidationError('All fields are required');
      return;
    }

    try {
      const formattedLectureDate = lectureDate.toISOString();
      const formattedClassStartTime = classStartTime ? new Date(`2023-12-26T${classStartTime}`).toISOString() : null;
      const formattedClassEndTime = classEndTime ? new Date(`2023-12-26T${classEndTime}`).toISOString() : null;
      const response = await axios.post(API_BASE_URL+'/api/FacultyApplication/FacLectureProgressInsert', {
        CreatedBy: loginParams, 
        ProcessId: 1, 
        CampusId: 100, 
        OfferedCoursesCourseId: courseInfo.courseID, 
        UserId: loginParams, 
        SemesterId: courseInfo.semesterID, 
        SemesterSectionId: courseInfo.semesterSectionID, 
        LectureNo: lastLectureNumber + 1,
        LectureDate: formattedLectureDate,
        ClassStartTime: formattedClassStartTime,
        ClassEndTime: formattedClassEndTime,
        ClassStatus: classStatus.toString(), 
        TopicsCovered: topicsCovered,
        IsAttendanceMarked: 0,
        ClassActivity: classActivity,
      });

      if (response.data.isSuccess) {
        console.log('Lecture progress inserted successfully');
        onClose();
        refreshData();
      } else {
        console.error('Error inserting lecture progress:', response.data.message);
      }
    } catch (error) {
      console.error('Error inserting lecture progress:', error.message);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    setLectureDate(date);
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Insert Lecture Progress</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lecture No: {lastLectureNumber + 1}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lecture Date:</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={styles.dateText}>{lectureDate.toDateString()}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Day</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={lectureDate.getDate()}
                      onValueChange={(day) => setLectureDate(new Date(lectureDate.getFullYear(), lectureDate.getMonth(), day))}
                    >
                      <Picker.Item label="" value="" />
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <Picker.Item key={day} label={day.toString()} value={day} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Month</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={lectureDate.getMonth()}
                      onValueChange={(month) => setLectureDate(new Date(lectureDate.getFullYear(), month, lectureDate.getDate()))}
                    >
                      <Picker.Item label="" value="" />
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <Picker.Item key={month} label={month.toString()} value={month - 1} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Year</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={lectureDate.getFullYear()}
                      onValueChange={(year) => setLectureDate(new Date(year, lectureDate.getMonth(), lectureDate.getDate()))}
                    >
                      <Picker.Item label="" value="" />
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <Picker.Item key={year} label={year.toString()} value={year} />
                      ))}
                    </Picker>
                  </View>
                </>
              )}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Class Start Time:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={classStartTime}
                  onValueChange={(itemValue) => setClassStartTime(itemValue)}
                >
                  <Picker.Item label="Select Time" value="" />
                  <Picker.Item label= "07:00 AM" value="07:00:00" />
                  <Picker.Item label= "08:00 AM" value="08:00:00" />
                  <Picker.Item label= "09:00 AM" value="09:00:00" />
                  <Picker.Item label= "10:00 AM" value="10:00:00" />
                  <Picker.Item label= "11:00 AM" value="11:00:00" />
                  <Picker.Item label= "12:00 PM" value="12:00:00" />
                  <Picker.Item label= "01:00 PM" value="13:00:00" />
                  <Picker.Item label= "02:00 PM" value="14:00:00" />
                  <Picker.Item label= "03:00 PM" value="15:00:00" />
                  <Picker.Item label= "04:00 PM" value="16:00:00" />
                  <Picker.Item label= "05:00 PM" value="17:00:00" />
                  <Picker.Item label= "06:00 PM" value="18:00:00" />
                  <Picker.Item label= "07:00 PM" value="19:00:00" />
                  <Picker.Item label= "08:00 PM" value="20:00:00" />
                  <Picker.Item label= "09:00 PM" value="21:00:00" />
                  <Picker.Item label= "10:00 PM" value="22:00:00" />
                  <Picker.Item label= "11:00 PM" value="23:00:00" />
                  <Picker.Item label= "12:00 AM" value="24:00:00" />
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Class End Time:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={classEndTime}
                  onValueChange={(itemValue) => setClassEndTime(itemValue)}
                >
                  <Picker.Item label="Select Time" value="" />
                  <Picker.Item label= "07:00 AM" value="07:00:00" />
                  <Picker.Item label= "08:00 AM" value="08:00:00" />
                  <Picker.Item label= "09:00 AM" value="09:00:00" />
                  <Picker.Item label= "10:00 AM" value="10:00:00" />
                  <Picker.Item label= "11:00 AM" value="11:00:00" />
                  <Picker.Item label= "12:00 PM" value="12:00:00" />
                  <Picker.Item label= "01:00 PM" value="13:00:00" />
                  <Picker.Item label= "02:00 PM" value="14:00:00" />
                  <Picker.Item label= "03:00 PM" value="15:00:00" />
                  <Picker.Item label= "04:00 PM" value="16:00:00" />
                  <Picker.Item label= "05:00 PM" value="17:00:00" />
                  <Picker.Item label= "06:00 PM" value="18:00:00" />
                  <Picker.Item label= "07:00 PM" value="19:00:00" />
                  <Picker.Item label= "08:00 PM" value="20:00:00" />
                  <Picker.Item label= "09:00 PM" value="21:00:00" />
                  <Picker.Item label= "10:00 PM" value="22:00:00" />
                  <Picker.Item label= "11:00 PM" value="23:00:00" />
                  <Picker.Item label= "12:00 AM" value="24:00:00" />
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Class Status:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={classStatus}
                  onValueChange={(itemValue) => setClassStatus(itemValue)}
                >
                  <Picker.Item label="Select Status" value="" />
                  <Picker.Item label="Held" value="H" />
                </Picker>
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Topics Covered"
              value={topicsCovered}
              onChangeText={(text) => setTopicsCovered(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Class Activity"
              value={classActivity}
              onChangeText={(text) => setClassActivity(text)}
            />
            <Text style={styles.errorText}>{validationError}</Text>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => onClose()} color={COLORS.red} />
              <Button title="Insert" onPress={() => { handleInsert(); scrollToBottom(); }} color={COLORS.blue} />
            </View>
            
          </View>
        
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {

  },
  dialogContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '90%',
    padding: 20,
    height: '93%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fieldContainer: {
    marginBottom: 10,
    width: '100%',
  },
  pickerContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
});

export default LectureInsertDialog;
