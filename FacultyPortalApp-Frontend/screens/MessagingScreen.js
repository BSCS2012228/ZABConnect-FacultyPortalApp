import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/en-au'; // Import the locale for English (Australia)
import API_BASE_URL from '../apiConfig';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the floating button
import { useNavigation } from '@react-navigation/native';

const MessagingScreen = ({ route }) => {
  const { userId, firstName, lastName, rolDegProCouList } = route.params || {};
  const [conversations, setConversations] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/GetConversation', {
        UserId: userId,
      });
      if (response.data.isSuccess) {
        const conversationsData = response.data.conversations;
        console.log(conversations);
        await fetchLastMessages(conversationsData);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastMessages = async (conversationsData) => {
    try {
      const updatedConversations = await Promise.all(
        conversationsData.map(async (conversation) => {
          const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/ViewMessages', {
            ConversationID: conversation.conversationID,
          });
          if (response.data.isSuccess && response.data.messages.length > 0) {
            const lastMessage = response.data.messages[response.data.messages.length - 1];
            return { ...conversation, lastMessage };
          }
          return conversation;
        })
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error fetching last messages:', error.message);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.messageBubble} 
        onPress={() => handleConversationSelection(item)}
      >
        <Avatar
          rounded
          title={`${item.otherUserFirstName.charAt(0)}${item.otherUserLastName.charAt(0)}`}
          containerStyle={styles.avatarContainer}
        />
        <View style={styles.messageContentContainer}>
          <Text style={styles.senderName}>{item.otherUserFirstName} {item.otherUserLastName}</Text>
          {item.lastMessage && (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessageText}>{item.lastMessage.content}</Text>
              <Text style={styles.lastMessageTime}>{formatLastMessageDate(item.lastMessage)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleConversationSelection = (item) => {
    navigation.navigate('ConversationViewScreen', {  
        conversationID: item.conversationID,
        otherUserID: item.otherUserID,
        otherUserName: item.otherUserFirstName+''+item.otherUserLastName,
        userId: userId,
        firstName: firstName,
        lastName:lastName,
        rolDegProCouList:rolDegProCouList
        });

  };

  const newChat = () => {
    navigation.navigate('NewChat', {  
        userId: userId,
        firstName: firstName,
        lastName:lastName,
        rolDegProCouList:rolDegProCouList
        });
  };

  const formatLastMessageDate = (lastMessage) => {
    if (!lastMessage || !lastMessage.timestamp) return '';

    const today = moment();
    const messageDate = moment(lastMessage.timestamp);

    if (today.diff(messageDate, 'days') === 0) {
      return messageDate.format('LT'); // Today: Show only time
    } else if (today.diff(messageDate, 'days') === 1) {
      return 'Yesterday'; // Yesterday
    } else {
      return messageDate.format('MMM D'); // Any other day: Show date
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messaging" userId={userId} rolDegProCouList={rolDegProCouList} firstName={firstName} lastName={lastName}/>
      <View style={styles.contentContainer}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.conversationID.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator = {false}
          />
        )}
      </View>
      {/* Floating New Message Button */}
      <TouchableOpacity style={styles.newMessageButton} onPress={newChat}>
        <Ionicons name="chatbubble" size={24} color="white" />
      </TouchableOpacity>
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
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 10,
  },
  avatarContainer: {
    marginRight: 15,
    backgroundColor: COLORS.blue,
  },
  messageContentContainer: {
    flex : 1,
},
senderName: {
  fontWeight: 'bold',
  marginBottom: 5,
  fontSize: 16, // Larger font size
},
lastMessageContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
lastMessageText: {
  flex: 1,
  color: '#666666',
  fontSize: 16, // Larger font size
},
lastMessageTime: {
  color: '#666666',
  marginLeft: 10,
  fontSize: 14, // Larger font size
},
newMessageButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: COLORS.blue,
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default MessagingScreen;

