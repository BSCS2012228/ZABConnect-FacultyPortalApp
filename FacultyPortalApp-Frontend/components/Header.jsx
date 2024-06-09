import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';

const Header = ({ title,rolDegProCouList, userId, firstName, lastName }) => {
    const navigation = useNavigation();

    const onDashPress = () => {
        // Navigate to the Dashboard screen
        navigation.navigate('Dashboard', { 
            firstName: firstName, 
            lastName: lastName, 
            userId: userId,
            rolDegProCouList: rolDegProCouList, });
    };

    const onMessagePress = () => {
        navigation.navigate('MessagingScreen', {  
            userId: userId,
            firstName: firstName, 
            lastName: lastName, 
            rolDegProCouList: rolDegProCouList,});
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onDashPress} style={styles.iconContainer}>
                <Image source={require('../assets/icons/dashboard.png')} style={styles.customIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onMessagePress} style={styles.iconContainer}>
                <Image source={require('../assets/icons/Messaging.png')} style={styles.customIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    iconContainer: {
        padding: 5,
    },
    customIcon: {
        width: 24, 
        height: 24, 
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
});

export default Header;
