import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import COLORS from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';

const RecapSheetScreen = ({ route }) => {
    const { loginParams, courseInfo, rolDegProCouList, firstName, lastName } = route.params || {};
    const [isLoading, setIsLoading] = useState(true);
    const [recapSheetData, setRecapSheetData] = useState(null);
    const [gradingPlan, setGradingPlan] = useState(null);
    const [marksDistribution, setMarksDistribution] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const recapSheetResponse = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetRecapsheetRecord', {
                SemesterId: courseInfo.semesterID,
                SemesterSectionId: courseInfo.semesterSectionID,
                UserId: loginParams,
                CourseId: courseInfo.courseID,
            });

            if (recapSheetResponse.data.isSuccess) {
                setRecapSheetData(recapSheetResponse.data.recordsByStudent);
                setGradingPlan(recapSheetResponse.data.gradingPlan);
                calculateTotalMarksForStudents(recapSheetResponse.data.recordsByStudent);
            } else {
                console.error('Error fetching recap sheet records:', recapSheetResponse.data.message);
            }

            const marksDistributionResponse = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetCourseOutlineMarksDistribution', {
                UserId: loginParams,
                SemesterId: courseInfo.semesterID,
                SectionId: courseInfo.semesterSectionID,
                CourseId: courseInfo.courseID,
            });

            if (marksDistributionResponse.data.isSuccess) {
                setMarksDistribution(marksDistributionResponse.data.marksDistribution);
            } else {
                console.error('Error fetching marks distribution:', marksDistributionResponse.data.message);
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalMarksForStudents = (recordsByStudent) => {
        if (!recordsByStudent) return;
        
        const updatedRecapSheetData = { ...recordsByStudent };

        for (const studentId in updatedRecapSheetData) {
            if (Object.hasOwnProperty.call(updatedRecapSheetData, studentId)) {
                const student = updatedRecapSheetData[studentId];
                let totalMarks = 0;
                student.marks.forEach(mark => {
                    totalMarks += mark.marksObtained;
                });
                student.totalMarks = totalMarks;
            }
        }

        setRecapSheetData(updatedRecapSheetData);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const getMarkHeader = (marksHeadId, serialType) => {
        const mark = marksDistribution.find(mark => mark.marksHeadId === marksHeadId);
        if (mark) {
            return `${mark.marksHeadDescription} ${serialType} (${mark.totalMarks})`;
        }
        return `Marks for ${marksHeadId}`;
    };

    return (
        <SafeAreaView backgroundColor={COLORS.white} paddingBottom={RFValue(200)}>
            <Header title="Recapsheet" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />

            <View paddingHorizontal={RFValue(20)}>
                <Text style={styles.greetingText}>
                    Course Name: {courseInfo.courseName}
                    {'\n'}
                    Program Name: {courseInfo.programName}
                    {'\n'}
                    Section: {courseInfo.semesterSectionName}
                </Text>
            </View>
            <ScrollView>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.container}>
                        <ScrollView>
                            <View style={styles.table}>
                                <View style={styles.headerRow}>
                                    <Text style={[styles.fixedCell, styles.headerText]}>Student Name</Text>
                                    {recapSheetData && Object.values(recapSheetData)[0].marks.map((mark, index) => (
                                        <View key={index} style={[styles.cell, styles.headerText]}>
                                            <Text>{getMarkHeader(mark.marksHeadId, mark.marksTypeSerialNo)}</Text>
                                        </View>
                                    ))}
                                    <Text style={[styles.cell, styles.headerText]}>Total</Text>
                                </View>
                                {recapSheetData && Object.values(recapSheetData).map(student => (
                                    <View key={student.studentId} style={styles.dataRow}>
                                        <Text style={styles.fixedCell}>{student.fullName}</Text>
                                        {student.marks.map((mark, index) => (
                                            <Text key={index} style={[styles.cell, styles.cellText]}>{mark.marksObtained}</Text>
                                        ))}
                                        <Text style={[styles.cell, styles.cellText]}>{student.totalMarks}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={styles.gradingPlanContainer}>
                    <Text style={styles.sectionTitle}>Grading Plan</Text>
                    <View style={styles.gradingPlanTable}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.fixedCell, styles.headerText]}>Grade</Text>
                            <Text style={[styles.cell, styles.headerText]}>Marks From - Marks To</Text>
                            <Text style={[styles.cell, styles.headerText]}>GPA</Text>
                        </View>
                        {gradingPlan && gradingPlan.map((plan, index) => (
                            <View key={index} style={styles.dataRow}>
                                <Text style={styles.fixedCell}>{plan.grade}</Text>
                                <Text style={styles.fixedCell}>{plan.marksFrom} - {plan.marksTo}</Text>
                                <Text style={styles.fixedCell}>{plan.gpa}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    table: {
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: COLORS.gray,
        borderRadius: 5,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    greetingText: {
        fontSize: RFValue(19),
        fontWeight: '300',
        textAlign: 'left',
        marginBottom: RFValue(10),
    },
    headerCell: {
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    fixedCell: {
        width: 150, 
        paddingVertical: 10,
        paddingHorizontal: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    cell: {
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    cellText: {
        textAlign: 'center',
    },
    gradingPlanContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray,
        paddingTop: 20,
        margin: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    gradingPlan: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planRow: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    planText: {
        marginHorizontal: 10,
    },
    gradingPlanTable: {
        marginTop: 20,
        borderWidth: 0.5,
        borderColor: COLORS.gray,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 80,
    },
    gradingPlanHeader: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    gradingPlanCell: {
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default RecapSheetScreen;
