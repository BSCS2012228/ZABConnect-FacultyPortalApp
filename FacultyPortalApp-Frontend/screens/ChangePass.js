import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import axios from 'axios';
import Header from '../components/Header';
import API_BASE_URL from '../apiConfig';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';

const ChangePass = ({ route }) => {
    const { userID } = route.params || {};
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();


    const handleChangePassword = async () => {
        try {
     
            if (newPassword !== newConfirmPassword) {
                setErrorMessage('New password and confirm password do not match.');
                return;
            }

            const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/changepassword', {
                UserId: userID, 
                NewPassword: newPassword,
            });

           
            if (response.data.isSuccess) {
                setErrorMessage('Password changed successfully.');
                navigation.navigate('Login');
            } else {
                setErrorMessage(response.data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Change password error:', error);
            setErrorMessage('An error occurred while changing the password.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
            <Text style={styles.heading}>Change Your Password</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your new password'
                        placeholderTextColor={COLORS.white}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm your new password'
                        placeholderTextColor={COLORS.white}
                        secureTextEntry
                        value={newConfirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                {errorMessage ? (
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                ) : null}
                <Button
                    title="Change Password"
                    filled
                    onPress={handleChangePassword}
                    style={styles.changePasswordButton}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 5,
    },
    heading: {
        fontSize: 25,
        alignItems: 'center',
        marginBottom: 30,
      },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        width: '80%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.blue,
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderRadius: 10,
        borderColor: COLORS.blue,
        borderWidth: 1,
        paddingLeft: 16,
        color: COLORS.blue,
        width: '100%',
    },
    changePasswordButton: {
        alignSelf: 'center',
        width: '50%',
        backgroundColor: COLORS.blue,
    },
    errorMessage: {
        color: COLORS.blue,
        marginBottom: 10,
        textAlign: 'center',
    },
    
});

export default ChangePass;
