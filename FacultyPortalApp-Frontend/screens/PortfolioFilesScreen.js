import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Linking, TextInput, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import COLORS from '../constants/colors';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';

const PortfolioFilesScreen = ({ route }) => {
  const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params;
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [weekNumber, setWeekNumber] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPortfolioFiles();
  }, []);

  const fetchPortfolioFiles = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetPortfolioFiles', {
        semesterId: courseInfo.semesterID,
        semesterSectionId: courseInfo.semesterSectionID,
        userId: loginParams,
        courseId: courseInfo.courseID,
      });

      if (response.data.isSuccess) {
        setPortfolioFiles(response.data.portfolioFiles);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilePress = async (fileLocation) => {
    try {
      const fileUrl = API_BASE_URL+'/api/FacultyApplication/Download?fileName=' + encodeURIComponent(fileLocation);
      await Linking.openURL(fileUrl);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
  
      if (res.type !== 'cancel') {
        console.log('Selected file:', res); // Log the selected file object
        setSelectedFile(res);
      }
    } catch (err) {
      console.error('Error picking file:', err); // Log any errors that occur
      setError(err.message);
    }
  };
  

  const handleFileUpload = async () => {
    try {
        if (!selectedFile) {
            setModalError('Please attach a file.');
            return;
        }
        if (!weekNumber || !description || !title) {
            setModalError('Please fill in all required fields (Week Number, Description, Title).');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: selectedFile.assets[0].uri,
            type: selectedFile.assets[0].mimeType || 'application/octet-stream',
            name: selectedFile.assets[0].name,
        });

        console.log('Uploading file...');
        const uploadResponse = await axios.post(`${API_BASE_URL}/api/FacultyApplication/UploadPortfolioFile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Response received:', uploadResponse.data);
        if (uploadResponse.data.isSuccess) {
            console.log('File uploaded successfully:', uploadResponse.data.message);

            // Call InsertCoursePortfolio API after successful file upload
            const portfolioResponse = await axios.post(`${API_BASE_URL}/api/FacultyApplication/InsertCoursePortfolio`, {
                CampusId: 100,
                OfferedCourseId: courseInfo.courseID,
                UserId: loginParams,
                SemesterId: courseInfo.semesterID,
                SemesterSectionId: courseInfo.semesterSectionID,
                WeekNumber: weekNumber,
                Description: description,
                Title: title,
                FileName: selectedFile.assets[0].name,
            });

            console.log('Portfolio API Response:', portfolioResponse.data);
            if (portfolioResponse.data.isSuccess) {
                console.log('Portfolio inserted successfully:', portfolioResponse.data.message);
                fetchPortfolioFiles(); // Refresh the portfolio files list after successful operations
                setModalVisible(false); // Close the modal after successful operations
                setSelectedFile(null); // Reset selected file
            } else {
                setModalError(portfolioResponse.data.message);
            }
        } else {
            setModalError(uploadResponse.data.message);
        }
    } catch (err) {
        console.error('File upload error:', err); // Log detailed error
        if (err.response) {
            console.error('Response error data:', err.response.data);
            console.error('Response error status:', err.response.status);
            console.error('Response error headers:', err.response.headers);
        }
        setModalError('File upload failed. Please try again.');
    }
};



  return (
    <SafeAreaView style={styles.container}>
      <Header title="Portfolio Files" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.insertButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.insertButtonText}>Upload Portfolio File</Text>
        </TouchableOpacity>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : portfolioFiles.length === 0 ? (
          <Text>No portfolio files found.</Text>
        ) : (
          <FlatList
            data={portfolioFiles}
            keyExtractor={(item) => item.facCoursePortfolioId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.portfolioFileItem} onPress={() => handleFilePress(item.fileLocation)}>
                <Text style={styles.portfolioFileTitle}>{item.title}</Text>
                <Text style={styles.portfolioFileDescription}>{item.fileLocation}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {/* Modal for uploading portfolio file */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedFile(null); // Reset selected file when closing modal
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Week Number"
              onChangeText={setWeekNumber}
              value={weekNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={setDescription}
              value={description}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={setTitle}
              value={title}
            />
            <TouchableOpacity style={styles.attachButton} onPress={handleFilePick}>
              <Text style={styles.attachButtonText}>Attach File</Text>
            </TouchableOpacity>
            {selectedFile && (
              <Text style={styles.selectedFileText}>{selectedFile.assets[0].name}</Text>
            )}
            <Text style={styles.errorText}>{modalError}</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  errorText: {
    color: COLORS.red,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    margin: 2,
    marginBottom: 50,
  },
  portfolioFileItem: {
    padding: RFValue(20),
    backgroundColor: COLORS.white,
    margin: RFValue(10),
    borderRadius: RFValue(20),
    elevation: RFValue(7),
  },
  insertButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
  },
  insertButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  portfolioFileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  portfolioFileDescription: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RFValue(20),
    padding: RFValue(20),
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: RFValue(5),
    padding: RFValue(10),
    marginBottom: RFValue(10),
  },
  attachButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: RFValue(10),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
  },
  attachButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  selectedFileText: {
    marginBottom: RFValue(10),
    textAlign: 'center',
    color: COLORS.black,
    backgroundColor: COLORS.lightGray, // Add background color
    padding: RFValue(10), // Add padding for better readability
    fontSize: RFValue(10), // Increase font size
  },
  uploadButton: {
    backgroundColor: COLORS.green,
    paddingVertical: RFValue(10),
    borderRadius: RFValue(20),
    marginBottom: RFValue(10),
  },
  uploadButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: COLORS.red,
    paddingVertical: RFValue(10),
    borderRadius: RFValue(20),
  },
  closeButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default PortfolioFilesScreen;
