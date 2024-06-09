import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import axios from 'axios';
import Header from '../components/Header';
import API_BASE_URL from '../apiConfig';

const ChangePassword = ({ route }) => {
    const { loginParams, rolDegProCouList, firstName, lastName } = route.params || {};
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleChangePassword = async () => {
        try {
     
            if (newPassword !== newConfirmPassword) {
                setErrorMessage('New password and confirm password do not match.');
                return;
            }

            const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/changepassword', {
                UserId: loginParams, 
                NewPassword: newPassword,
            });

           
            if (response.data.isSuccess) {
                setErrorMessage('Password changed successfully.');
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
            <Header title="Change Password" userId={loginParams} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName} />
            <View style={styles.wrapper}>
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

export default ChangePassword;
