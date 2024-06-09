import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button'; 
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import OTP from './OTP';
import API_BASE_URL from '../apiConfig';

const ForgotPassword = () => {
    const [userID, setuserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleSendPassword = async () => {
        if (userID) {
            try {
                const response = await axios.post(API_BASE_URL+'/api/FacultyApplication/ForgotPass', { userId: userID });
                if (response.data.isSuccess) {
                    navigation.navigate('OTP', { verificationCode: response.data.verificationCode, userID: userID });
                    console.log(response.data);
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('Failed to send verification code. Please try again later.');
            }
        } else {
            setErrorMessage('Please enter your SZABIST ID');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo-white.png')}
                    style={styles.logo}
                    resizeMode='contain'
                />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>The OTP will be sent to your Number</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your SZABIST ID'
                        placeholderTextColor={COLORS.white}
                        keyboardType='email-address'
                        value={userID}
                        onChangeText={setuserId}
                    />
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <Button title="Submit" filled style={styles.submitButton} onPress={handleSendPassword} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.blue,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    logo: {
        height: 200,
        width: 200,
    },
    formContainer: {
        width: '80%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.grey,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.white,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        height: 48,
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 22,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        color: COLORS.white,
    },
    submitButton: {
        marginTop: 20,
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default ForgotPassword;
