import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors'; 
import Login from './Login';

const PasswordSentScreen = ({ navigation }) => {
    const handleContinueToLogin = () => {
        
        navigation.navigate(Login); 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Your new password is sent to your SZABIST email and number.
            </Text>
            <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueToLogin}
            >
                <Text style={styles.continueButtonText}>Continue to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    continueButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    continueButtonText: {
        color: COLORS.white, 
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PasswordSentScreen;
