import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Linking } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Header from '../components/Header';
import API_BASE_URL from '../apiConfig';

const ViewUploadedPDFsScreen = ({ route, navigation }) => {
    const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params;
    const [pdfList, setPdfList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUploadedPDFs();
    }, []);

    const fetchUploadedPDFs = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/FacultyApplication/ViewUploadedPDF`,{
                sUser_id: loginParams,
                CourseID: courseInfo.courseID,
                SemesterID: courseInfo.semesterID,
                SemesterSectionID: courseInfo.semesterSectionID,
            });

            if (response.data.isSuccess) {
                setPdfList(response.data.pdfList || []);
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch uploaded PDFs.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilePress = async (fileLocation) => {
        try {
            const fileUrl = `${API_BASE_URL}/api/FacultyApplication/Download?fileName=${encodeURIComponent(fileLocation)}`;
            await Linking.openURL(fileUrl);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to open PDF.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.fileDescription}</Text>
            <Text style={styles.itemDate}>Uploaded on: {new Date(item.dateCreated).toLocaleDateString()}</Text>
            <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleFilePress(item.fileLocation)}
            >
                <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="View Uploaded PDFs" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
            <TouchableOpacity
                style={styles.scanUploadButton}
                onPress={() => navigation.navigate('ScanAndUploadScreen', {
                    loginParams,
                    courseInfo,
                    rolDegProCouList,
                    firstName,
                    lastName
                })}
            >
                <Text style={styles.scanUploadButtonText}>Scan and Upload</Text>
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.blue} />
                ) : (
                    <>
                        {pdfList.length === 0 ? (
                            <Text style={styles.noDocumentsText}>No Documents uploaded</Text>
                        ) : (
                            <FlatList
                                data={pdfList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.pdfid.toString()}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </>
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
        paddingBottom: 80,
    },
    listContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        backgroundColor: COLORS.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        marginBottom: 5,
    },
    itemDate: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: COLORS.blue,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    scanUploadButton: {
        backgroundColor: COLORS.green,
        padding: 15,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    scanUploadButtonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    noDocumentsText: {
        textAlign: 'center',
        fontSize: 18,
        color: COLORS.gray,
    },
});

export default ViewUploadedPDFsScreen;
