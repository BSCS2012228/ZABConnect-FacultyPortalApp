import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import ChangePass from './ChangePass';

const OTP = ({ route }) => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  // Extracting verification code from route params
  const { userID, verificationCode } = route.params || {};

  const handleVerifyOtp = () => {
    if (otp === verificationCode) {
      navigation.navigate('ChangePass', { userID: userID });
      
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/arrow.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.heading}>OTP Verification</Text>
      </View>

      <View style={styles.otpBox}>
        <TextInput
          style={styles.otpInput}
          keyboardType='number-pad'
          placeholder='Enter OTP'
          value={otp}
          onChangeText={setOtp}
          maxLength={4} 
          
        />
      </View>

      <TouchableOpacity onPress={handleVerifyOtp} style={styles.verifyButton}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  backArrow: {
    width: 30,
    height: 30,
  },
  heading: {
    fontSize: 25,
    marginLeft: 20,
  },
  otpBox: {
    alignItems: 'center',
    marginTop: 50,
  },
  otpInput: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 20,
    width: 200,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
  },
  verifyText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default OTP;
