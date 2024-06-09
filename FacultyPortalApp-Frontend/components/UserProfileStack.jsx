import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from '../screens/userProfile';
import ChangePassScreen from '../screens/ChangePassword';

const Stack = createStackNavigator();

const UserProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
