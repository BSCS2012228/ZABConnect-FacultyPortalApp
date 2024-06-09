import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';
import Login from './Login';
import Header from '../components/Header';
import API_BASE_URL from '../apiConfig';
import { ScrollView } from 'react-native-gesture-handler';

const UserProfile = ({ route }) => {
    const { loginParams, rolDegProCouList, courseInfo, firstName, lastName } = route.params || {};
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState({});
    const UserProfile = loginParams;

    useEffect(() => {
        const fetchUserInformation = async () => {
          try {
            const response = await fetch(API_BASE_URL+'/api/FacultyApplication/GetUserProfile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: loginParams }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch course information');
            }
    
            const data = await response.json();
            if (data.isSuccess) {
              setUserProfile(data);
            } else {
              console.error('Course information fetch failed:', data.message);
            }
          } catch (error) {
            console.error('Error fetching course information:', error);
          }
        };
    
        fetchUserInformation();
      }, [loginParams]);

    const handleEditProfilePic = () => {
        
    };

    const handleFacultyGuidelines = () => {
        navigation.navigate('FacGuidelineScreen');
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleCourseOutline = () => {
        navigation.navigate('CourseOutlineShow');
    };

    const handleViewDailyClassSchedule = () => {
        navigation.navigate('DailyClassScheduleScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };

    const handleViewExamSchedule = () => {
        navigation.navigate('ExamScheduleScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };

    const handleViewPortfolioFiles = () => {
        navigation.navigate('PortfolioFilesScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };

    const handleViewOfferedCourses = () => {
        navigation.navigate('OfferedCoursesScreen');
    };

    const handleViewFullRecapsheet = () => {
        navigation.navigate('RecapSheetScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };

    const handleViewClassSchedule = () => {
        navigation.navigate('ClassSchedularScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };

    const handleScanAndUpload = () => {
        navigation.navigate('ViewUploadedPDFsScreen',{ loginParams, courseInfo, rolDegProCouList, firstName, lastName });
    };
    
    

    const handleLogout = () => {
        navigation.navigate(Login);
    };

    return (
        <SafeAreaView style={styles.container}>
        
            <Header title="Profile" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={userProfile.firstName} lastName={userProfile.lastName} />
            
            <View style={styles.contentContainer}>
                <View style={styles.cardContainer}>
                <View style={styles.profileContainer}>
                    <TouchableOpacity onPress={handleEditProfilePic}>
                        <Image source={require('../assets/icons/UP.png')} style={styles.profileImage} />
                    </TouchableOpacity>
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.FirstName}>{userProfile.firstName}</Text>
                        <Text style={styles.LastName}>{userProfile.lastName}</Text>
                    </View>
                </View>
                
                <View style={styles.additionalInfoContainer}>
                
                    <View style={styles.infoRow}>
                        <Image source={require('../assets/icons/mail.png')} style={styles.infoIcon} />
                        <Text style={styles.infoText}>{userProfile.email}</Text>
                    </View>

            
                    <View style={styles.infoRow}>
                        <Image source={require('../assets/icons/call.png')} style={styles.infoIcon} />
                        <Text style={styles.infoText}>{userProfile.number}</Text>
                    </View>

           
                    <View style={styles.infoRow}>
                        <Image source={require('../assets/icons/cnic.png')} style={styles.infoIcon} />
                        <Text style={styles.infoText}>{userProfile.cnic}</Text>
                    </View>
                </View>
                </View>

            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuRow} onPress={handleCourseOutline}>
                    <Image source={require('../assets/icons/online-learning.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Course Outline</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleScanAndUpload}>
                    <Image source={require('../assets/icons/upload-document.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>View Uploaded Documents</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleFacultyGuidelines}>
                    <Image source={require('../assets/icons/guide.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Faculty Guidelines</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewOfferedCourses}>
                    <Image source={require('../assets/icons/offered.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Offered Courses</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewFullRecapsheet}>
                    <Image source={require('../assets/icons/graduation.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>View Full Recapsheet</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewPortfolioFiles}>
                    <Image source={require('../assets/icons/folder.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Portfolio Files</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewClassSchedule}>
                    <Image source={require('../assets/icons/classschedule.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Class Schedule</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewDailyClassSchedule}>
                    <Image source={require('../assets/icons/DailyClassSchedule.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Daily Class Schedule</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleViewExamSchedule}>
                    <Image source={require('../assets/icons/examination.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Exam Schedule</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleChangePassword}>
                    <Image source={require('../assets/icons/pass.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Change Password</Text>
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
                    <Image source={require('../assets/icons/power.png')} style={styles.menuIcon} />
                    <Text style={styles.menuText}>Logout</Text> 
                    <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                
            </View>
            </ScrollView>
            </View>
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
      },
      cardContainer: {
        backgroundColor: COLORS.blue,
        borderRadius: 15,
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
        elevation: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    profileTextContainer: {
        marginLeft: 20,
    },
    FirstName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    additionalInfoContainer: {
      
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
    },
    infoText: {
        fontSize: 50,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    LastName: {
        fontSize: 20,
        color: COLORS.white,
    },
    additionalInfoContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: COLORS.white,
        marginBottom: 5,
    },
    menuContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
        paddingBottom: 80,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    menuText: {
        fontSize: 18,
        flex: 1,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        transform: [{ rotate: '180deg' }]
    },
});

export default UserProfile;