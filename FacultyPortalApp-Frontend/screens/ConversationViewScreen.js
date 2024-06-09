import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

const ConversationViewScreen = ({ route }) => {
  const { userId, otherUserID, otherUserName } = route.params;
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/ViewMessages', {
        ConversationID: route.params.conversationID,
      });
      if (response.data.isSuccess) {
        const categorizedMessages = response.data.messages.map(message => ({
          ...message,
          isSentByCurrentUser: message.senderID.toLowerCase() === userId.toLowerCase(),
          isSentByOtherUser: message.senderID.toLowerCase() === otherUserID.toLowerCase(),
        }));
        setMessages(categorizedMessages);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimestamp = timestamp => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(API_BASE_URL + '/api/FacultyApplication/SendMessage', {
        SenderID: userId,
        RecipientID: otherUserID,
        Content: newMessage,
        Timestamp: new Date().toISOString(), // Assuming API expects ISO 8601 formatted timestamp
      });
      if (response.data.isSuccess) {
        // Update state with the new message
        const newMessageObj = {
          content: newMessage,
          isSentByCurrentUser: true,
          isSentByOtherUser: false,
          timestamp: new Date().toISOString(), // Assuming API returns the timestamp of the new message
        };
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
        // Clear the input field
        setNewMessage('');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.messageContainer, item.isSentByCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer]}>
        <View style={[styles.messageBubble, item.isSentByCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.timestampText}>{renderTimestamp(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  // Inside the ConversationViewScreen component

  return (
    <SafeAreaView style={styles.container}>
      <Header title={otherUserName} userId={userId} rolDegProCouList={route.params.rolDegProCouList} firstName={route.params.firstName} lastName={route.params.lastName} />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => (item.messageID ? item.messageID.toString() : null)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }} // Ensure the list fills the available space
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={text => setNewMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  messageContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  newChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatText: {
    fontSize: 18,
    color: COLORS.black,
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 5,
  },
  sentMessageBubble: {
    backgroundColor: COLORS.blue, // Change the color to differentiate sent messages
  },
  receivedMessageBubble: {
    backgroundColor: COLORS.lightBlue,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.white,
  },
  timestampText: {
    fontSize: 10,
    color: COLORS.grey,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.grey,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 70,
    height: 40,
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default ConversationViewScreen;
