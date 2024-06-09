import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import Header from '../components/Header';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the arrow button
import COLORS from '../constants/colors';

const NewChat = ({ route, navigation }) => {
  const { userId, firstName, lastName, rolDegProCouList } = route.params || {};
  const [searchInput, setSearchInput] = useState('');
  const [userProfiles, setUserProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetUserProfileforMessage', {
        SearchInput: searchInput,
      });
      if (response.data.isSuccess) {
        setUserProfiles(response.data.userProfiles);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user profiles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = (item) => {
    navigation.navigate('NewConversationScreen', {  
        otherUserID: item.userId,
        otherUserName: item.firstName+''+item.lastName,
        userId: userId,
        firstName: firstName,
        lastName:lastName,
        rolDegProCouList:rolDegProCouList
        });
        console.log(item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.profileButton} onPress={() => handleProfilePress(item)}>
      <Avatar
        rounded
        title={`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}
        containerStyle={styles.avatarContainer}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profileFullName}>
          {item.firstName} {item.middleName && item.middleName + ' '} {item.lastName}
        </Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messaging" userId={userId} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName}/>
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter search query..."
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Searching...' : 'Search'}</Text>
        </TouchableOpacity>
        <FlatList
          data={userProfiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator= {false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    borderRadius: 13,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  avatarContainer: {
    marginRight: 10,
    backgroundColor: COLORS.blue, // Blue circle background color
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  profileFullName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default NewChat;
