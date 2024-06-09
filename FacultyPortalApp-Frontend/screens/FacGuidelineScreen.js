import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const FacGuidelineScreen = ({ route }) => {
  const { loginParams } = route.params || {};
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/FacGuidelineShow', {
        CampusId: 100, // Adjust as needed
      });

      if (response.data.isSuccess) {
        setGuidelines(response.data.facGuidelines);
      } else {
        console.error('Error fetching guidelines:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching guidelines:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Grouping guidelines by headId
  const groupedGuidelines = guidelines.reduce((acc, guideline) => {
    if (!acc[guideline.headId]) {
      acc[guideline.headId] = [];
    }
    acc[guideline.headId].push(guideline);
    return acc;
  }, {});

  // Sorting headIds
  const sortedHeadIds = Object.keys(groupedGuidelines).sort((a, b) => a - b);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Faculty Guidelines" userId={loginParams} />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {sortedHeadIds.map((headId) => (
              <View key={headId} style={styles.guidelineContainer}>
                <Text style={styles.guidelineHeading}>
                  {groupedGuidelines[headId][0].headLongDesc}
                </Text>
                {groupedGuidelines[headId].map((guideline, index) => (
                  <Text key={index} style={styles.guidelineDetail}>
                    {index + 1}. {guideline.detailDesc}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
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
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  scrollView: {
    marginBottom: 70,
  },
  guidelineContainer: {
    marginBottom: 20,
  },
  guidelineHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guidelineDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  guidelinePostedBy: {
    fontSize: 14,
    color: 'gray',
  },
});

export default FacGuidelineScreen;
