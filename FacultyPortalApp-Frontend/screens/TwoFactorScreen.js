import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import COLORS from '../constants/colors'; 
import otp from './otp';


const TwoFactorScreen = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState('phone');
  const navigation = useNavigation(); 

  const handleSubmit = () => {
 
    navigation.navigate('Otp'); 
  };

  const handleLearnMore = () => {
 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Two Factor Verification</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Two-Factor</Text>
          <Switch
            value={isTwoFactorEnabled}
            onValueChange={setIsTwoFactorEnabled}
            thumbColor={isTwoFactorEnabled ? COLORS.black : COLORS.white}
            trackColor={{ false: COLORS.grey, true: COLORS.blue }}
          />
        </View>
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoTextGray}>Activate this feature for enhanced account security</Text>
        <Text style={styles.infoText}>Select profile to apply this job</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
          style={[
            styles.picker,
            {
              width: 350,
              borderColor: isTwoFactorEnabled ? COLORS.secondary : COLORS.grey,
            },
          ]}
        >
          <Picker.Item label="Phone Number SMS" value="phone" />
          <Picker.Item label="Email" value="email" />
        </Picker>
      </View>
      <View style={styles.logoutInfoTextContainer}>
        <Text style={styles.logoutInfoText}>
          Turning this feature on will sign you out from any other device you're currently signed in to. You will then be required to enter a verification code the first time you sign in with a new device or Joby mobile application.
        </Text>
        <TouchableOpacity onPress={handleLearnMore}>
          <Text style={styles.learnMoreButton}>Learn More</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonSpacing} />
      <View style={styles.footer}>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isTwoFactorEnabled ? COLORS.blue : COLORS.grey },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Set Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
  },
  infoTextContainer: {
    padding: 16,
  },
  infoTextGray: {
    color: COLORS.grey,
  },
  infoText: {
    color: COLORS.black,
  },
  pickerContainer: {
    alignItems: 'center',
    padding: 10,
    borderColor: COLORS.grey,
    borderRadius: 100,
  },
  picker: {
    height: 40,
    borderRadius: 5,
  },
  logoutInfoTextContainer: {
    padding: 16,
    marginBottom: 16,
  },
  logoutInfoText: {
    color: COLORS.grey,
  },
  learnMoreButton: {
    color: COLORS.blue,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacing: {
    flex: 0.5,
  },
  submitButton: {
    width: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TwoFactorScreen;
