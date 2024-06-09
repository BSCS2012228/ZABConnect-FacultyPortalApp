import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import COLORS from '../constants/colors';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const ReminderPopup = ({ visible, onClose, loginParams }) => {
  const [classScheduleDetails, setClassScheduleDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (visible) {
      fetchClassScheduleDetails();
    }
  }, [visible]);

 

  const fetchClassScheduleDetails = async () => {
    const date = new Date();
    const formattedDate = `${"2022"}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    console.log(formattedDate);
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/FacultyApplication/GetDailyClassSchedule`, {
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.popup}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Error: {error}</Text>
          ) : classScheduleDetails.length === 0 ? (
            <Text style={styles.popupText}>No class scheduled today</Text>
          ) : (
            <>
              <Text style={styles.popupText}>Today Class Schedule</Text>
              {classScheduleDetails.map((schedule, index) => (
                <Text key={index}>Your Class: {schedule.courseName} is Scheduled from {schedule.startTime} to {schedule.endTime}</Text>
              ))}
            </>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: COLORS.white,
    padding: RFValue(20),
    borderRadius: RFValue(10),
    alignItems: 'center',
    width: '80%',
  },
  popupText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(5),
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default ReminderPopup;
