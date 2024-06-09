import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import ShowLectureAttendance from '../screens/ShowLectureAttendance';
import LectureProgressShow from '../screens/LectureProgressShow';
import Icon from './Icon';
import { colors, sizes } from '../constants/theme';
import { StyleSheet, Animated, Text, View } from 'react-native';
import COLORS from '../constants/colors';
import UserProfileStack from '../screens/UserProfileStack';
import CourseOutlineMarksDistributionScreen from '../screens/CourseOutlineMarksDistributionScreen'



const tabs = [
  {
    name: 'Home',
    screen: HomeScreen,
  },
  {
    name: 'LecProgress',
    screen: LectureProgressShow,
  },
  {
    name: 'Attendance',
    screen: ShowLectureAttendance,
  },
  {
    name: 'Recapsheet',
    screen: CourseOutlineMarksDistributionScreen,
  },
  {
    name: 'More',
    screen: UserProfileStack,
  },
];

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const { loginParams, courseInfo, firstName, lastName, rolDegProCouList, userId } = route.params || {}; 

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        {tabs.map(({ name, screen }, index) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={screen}
              initialParams={{
                loginParams: loginParams, 
                courseInfo: courseInfo,
                firstName : firstName, 
                lastName: lastName, 
                rolDegProCouList: rolDegProCouList,
                userId: userId,
              }}
              options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <View style={{ alignItems: 'center' }}>
                      <Icon
                        icon={name}
                        size={30}
                        style={{
                          tintColor: focused ? 'white' : colors.white,
                        }}
                      />
                      <Text
                        style={{
                          color: focused ? 'white' : colors.white,
                          marginTop: 5,
                          fontSize: 12,
                        }}
                      >
                        {name}
                      </Text>
                    </View>
                  );
                },
              }}
              listeners={{
                focus: () => {
                  Animated.spring(offsetAnimation, {
                    toValue: index * (sizes.width / tabs.length),
                    useNativeDriver: true,
                  }).start();
                },
              }}
            />
          );
        })}
      </Tab.Navigator>

      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateX: offsetAnimation,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    width: 10,
    height: 2,
    left: sizes.width / tabs.length / 2 - 5,
    bottom: 6,
    backgroundColor: colors.white,
    zIndex: 100,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabBar: {
    backgroundColor: COLORS.blue,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: 'center',
  },
});

export default TabNavigator;
