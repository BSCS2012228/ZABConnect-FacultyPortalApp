import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChangePassword from './ChangePassword';
import UserProfile from './Profile';
import CourseOutlineShow from './CourseOutlineShow';
import FacGuidelineScreen from './FacGuidelineScreen';
import OfferedCoursesScreen from './OfferedCoursesScreen';
import PortfolioFilesScreen from './PortfolioFilesScreen';
import RecapSheetScreen from './RecapSheetScreen';
import { ScrollView } from 'react-native-gesture-handler';
import ClassSchedularScreen from './ClassSchedularScreen';
import DailyClassScheduleScreen from './DailyClassScheduleScreen';
import ExamScheduleScreen from './ExamScheduleScreen';
import ScanAndUploadScreen from './ScanAndUploadScreen';
import ViewUploadedPDFsScreen from './ViewUploadedPDFsScreen';

const Stack = createStackNavigator();

const UserProfileStack = ({route}) => {
  return (
    
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="CourseOutlineShow"
        component={CourseOutlineShow}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="FacGuidelineScreen"
        component={FacGuidelineScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="OfferedCoursesScreen"
        component={OfferedCoursesScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="PortfolioFilesScreen"
        component={PortfolioFilesScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="RecapSheetScreen"
        component={RecapSheetScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ClassSchedularScreen"
        component={ClassSchedularScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="DailyClassScheduleScreen"
        component={DailyClassScheduleScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ExamScheduleScreen"
        component={ExamScheduleScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ScanAndUploadScreen"
        component={ScanAndUploadScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
      <Stack.Screen
        name="ViewUploadedPDFsScreen"
        component={ViewUploadedPDFsScreen}
        options={{ headerShown: false }} 
        initialParams={{ ...route.params }}
      />
    </Stack.Navigator>
    
  );
};

export default UserProfileStack;
