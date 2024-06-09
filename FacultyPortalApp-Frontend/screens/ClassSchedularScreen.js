import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import COLORS from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';

const ClassSchedularScreen = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params;
  const [classSchedulars, setClassSchedulars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassSchedular();
  }, []);

  const fetchClassSchedular = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetClassSchedule', {});

      if (response.data.isSuccess) {
        setClassSchedulars(response.data.classSchedulars);
        console.log(response.data.classSchedulars)
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (url) => {
    try {
      await Linking.openURL(API_BASE_URL+'/api/FacultyApplication/Download?fileName='+url);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Class Schedule" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : classSchedulars.length === 0 ? (
          <Text>No class schedular data available.</Text>
        ) : (
          <FlatList
            data={classSchedulars}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleFileDownload(item.classSchedularPath)}>
                <Text style={styles.titleText}>{item.classScheduleTitle}</Text>
                <Text style={styles.subTitleText}>{item.classSubTitle}</Text>
                <Text style={styles.subTitleText}>{item.classSchedularPath}</Text>
              </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    textDecorationLine: 'underline',
  },
});

export default ClassSchedularScreen;
