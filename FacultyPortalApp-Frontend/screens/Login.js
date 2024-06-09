import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';

const Login = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        
    }, []);

    const checkIfLoggedIn = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedPassword = await AsyncStorage.getItem('password');

            if (storedUserId && storedPassword) {
             
                setUserId(storedUserId);
                setPassword(storedPassword);
            }
        } catch (error) {
            console.error('Error checking if logged in:', error);
        }
    };

    const handleLogin = async () => {
        try {
            if (!userId.trim() || !password.trim()) {
                setLoginMessage('Username and password are required.');
                return;
            }

            const response = await axios.post(API_BASE_URL+'/api/FacultyApplication/Login', { userId, password });

            if (response.data.isSuccess) {
                const { firstName, lastName } = response.data;
                setFirstName(firstName);
                setLastName(lastName);
                setLoginMessage('');

                // Store credentials if "Remember Me" is checked
                if (isChecked) {
                    await AsyncStorage.setItem('userId', userId);
                    await AsyncStorage.setItem('password', password);
                }

                navigation.navigate('Dashboard', { 
                    firstName: response.data.firstName, 
                    lastName: response.data.lastName, 
                    userId: userId,
                    rolDegProCouList: response.data.rolDegProCou,
                });
            } else {
                setLoginMessage('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPass');
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
                <Text style={styles.label}>ZABDESK ID</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your ZABDesk ID'
                        placeholderTextColor={COLORS.white}
                        keyboardType='email-address'
                        value={userId}
                        onChangeText={text => setUserId(text)} 
                    />
                </View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your password'
                        placeholderTextColor={COLORS.white}
                        secureTextEntry={!isPasswordShown}
                        value={password} 
                        onChangeText={text => setPassword(text)} 
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={styles.passwordVisibilityIcon}
                    >
                        <Ionicons
                            name={isPasswordShown ? 'eye-off' : 'eye'}
                            size={24}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Login" filled style={styles.loginButton} onPress={handleLogin} />
                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.forgotPasswordLabel}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                {loginMessage ? (
                    <Text style={styles.loginMessage}>{loginMessage}</Text>
                ) : null}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.blue,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logo: {
        height: 200,
        width: 200,
    },
    formContainer: {
        flex: 2,
        marginHorizontal: 22,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8,
        color: COLORS.white,
    },
    inputContainer: {
        width: '100%',
        height: 48,
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 22,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        color: COLORS.white,
    },
    passwordVisibilityIcon: {
        position: 'absolute',
        right: 12,
    },
    rememberMeLabel: {
        color: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    loginButton: {
        flex: 1,
        borderColor: COLORS.primary,
        marginRight: 8,
    },
    forgotPasswordButton: {
        textDecorationStyle: COLORS.black,
        color: COLORS.primary,
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotPasswordLabel: {
        color: COLORS.black,
    },
    loginMessage: {
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Login;