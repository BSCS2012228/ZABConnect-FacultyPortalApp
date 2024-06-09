import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Dimensions, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import COLORS from '../constants/colors';
import Header from '../components/Header';
import API_BASE_URL from '../apiConfig';

const { width, height } = Dimensions.get('window');

const ScanAndUploadScreen = ({ route }) => {
    const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [pdfPath, setPdfPath] = useState('');
    const [convertLoading, setConvertLoading] = useState(false); 
    const [uploadLoading, setUploadLoading] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePhoto = async () => {
        if (camera) {
            const photoData = await camera.takePictureAsync();
            setPhotos([...photos, photoData]);
        }
    };

    const convertToPDF = async () => {
        if (photos.length <= 2) {
            setConvertLoading(true); // Set loading to true when conversion starts
            // Conversion logic
            try {
                const base64Images = await Promise.all(
                    photos.map(async (photo) => {
                        const base64Data = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
                        return `data:image/jpeg;base64,${base64Data}`;
                    })
                );
                console.log('Number of images before PDF conversion:', base64Images.length);
                const htmlContent = `
                    <html>
                    <head>
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            .page {
                                page-break-after: always;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 100%;
                                height: 100%;
                                margin: 0;
                                padding: 20px;
                                box-sizing: border-box;
                            }
                            .page img {
                                max-width: 100%;
                                max-height: 100%;
                                margin: auto;
                                display: block;
                            }
                        </style>
                    </head>
                    <body>
                        ${base64Images.map(base64 => `<div class="page"><img src="${base64}" /></div>`).join('')}
                    </body>
                    </html>
                `;
    
                const { uri } = await Print.printToFileAsync({ html: htmlContent });
                setPdfPath(uri);
                Alert.alert('PDF Created', 'PDF has been created successfully.');

                console.log('Number of images after PDF conversion:', base64Images.length);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to convert images to PDF.');
            } finally {
                setConvertLoading(false); // Set loading to false after conversion completes
            }
        } else {
            Alert.alert('Error', 'You can only upload a maximum of two images.');
        }
    };

    const handleUploadPress = async () => {
        if (!showModal) {
            setShowModal(true);
        } else {
            // Execute file upload API and Insert PDF API
            await uploadPDF();
            await insertPDF();
            setShowModal(false);
        }
    };

    const cancelImage = (index) => {
        const updatedPhotos = [...photos];
        updatedPhotos.splice(index, 1);
        setPhotos(updatedPhotos);
    };

    const uploadPDF = async () => {
        if (pdfPath) {
            setUploadLoading(true); // Set loading to true when upload starts
            const formData = new FormData();
            formData.append('file', {
                uri: pdfPath,
                type: 'application/pdf',
                name: title+'.pdf',
            });

            try {
                const response = await axios.post(`${API_BASE_URL}/api/FacultyApplication/UploadPortfolioFile`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.isSuccess) {
                    Alert.alert('Success', 'PDF uploaded successfully.');
                } else {
                    Alert.alert('Error', response.data.message);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to upload PDF.');
            } finally {
                setUploadLoading(false); // Set loading to false after upload completes
            }
        } else {
            Alert.alert('Error', 'No PDF to upload.');
        }
    };

    const insertPDF = async () => {
        // Additional logic to insert PDF with required input
        const request = {
            sUser_id: loginParams,
            courseID: courseInfo.courseID,
            semesterID: courseInfo.semesterID,
            semesterSectionID: courseInfo.semesterSectionID,
            fileDescription: description,
            title: title,
            fileLocation: title+'.pdf',
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/FacultyApplication/InsertPDF`, request);

            if (response.data.isSuccess) {
                Alert.alert('Success', 'PDF inserted successfully.');
                setShowModal(false);
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to insert PDF.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Scan and Upload Photos" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
            <View style={styles.contentContainer}>
                <View style={styles.cameraContainer}>
                    <Camera style={styles.camera} ref={ref => setCamera(ref)}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                                <Text style={styles.buttonText}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
                <ScrollView style={styles.photoScroll} horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.photoContainer}>
                        {photos.map((photo, index) => (
                            <View key={index}  style={styles.imageContainer}>
                                <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
                                <TouchableOpacity onPress={() => cancelImage(index)} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>-</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.convertButton} onPress={convertToPDF} disabled={convertLoading}>
                        {convertLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Convert to PDF</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress} disabled={uploadLoading}>
                        {uploadLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Upload PDF</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Document</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter document title"
                            onChangeText={text => setTitle(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter document description"
                            onChangeText={text => setDescription(text)}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleUploadPress}
                            disabled={!title || !description} // Disable button if title or description is empty
                        >
                            <Text style={[styles.modalButtonText, { color: (!title || !description) ? COLORS.gray : COLORS.white }]}>Upload</Text>
                        </TouchableOpacity>
                        {(title === '' || description === '') && (
                            <Text style={styles.errorText}>Title and description are required.</Text>
                        )}
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
        padding: 20,
        paddingBottom: 80,
    },
    cameraContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    camera: {
        width: '100%',
        height: height * 0.45,
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    captureButton: {
        backgroundColor: COLORS.blue,
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    photoScroll: {
        marginVertical: 10,
    },
    photoContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    cancelButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: COLORS.red,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    convertButton: {
        backgroundColor: COLORS.green,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    uploadButton: {
        backgroundColor: COLORS.blue,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: COLORS.white,
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
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: COLORS.blue,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: COLORS.white,
        fontSize: 16,
    },
});

export default ScanAndUploadScreen;

