import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import Header from '../components/Header';
import COLORS from '../constants/colors';

const NewConversationScreen = ({ route }) => {
  const { userId, otherUserID, otherUserName } = route.params;
  const [messages, setMessages] = useState([]); // Update state to manage messages
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef();

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
          timestamp: new Date().toISOString(), // Assuming API returns the timestamp of the new message
        };
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
        // Scroll to bottom when new message is sent
        scrollViewRef.current.scrollToEnd({ animated: true });
        setNewMessage('');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title={otherUserName} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Render messages from state */}
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageContainer, message.isSentByCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer]}>
            <View style={[styles.messageBubble, message.isSentByCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble]}>
              <Text style={styles.messageText}>{message.content}</Text>
              <Text style={styles.timestampText}>{renderTimestamp(message.timestamp)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  messageContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
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

export default NewConversationScreen;
