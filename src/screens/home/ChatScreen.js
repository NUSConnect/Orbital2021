import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage
} from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import BackButton from '../../components/BackButton';
import * as firebase from 'firebase';

export default function ChatScreen({ route }) {

  const [messages, setMessages] = useState([]);
  const { thread } = route.params;
  const currentUser = firebase.auth().currentUser.uid;

  async function handleSend(messages) {
    const text = messages[0].text;
    firebase.firestore()
      .collection('THREADS')
      .doc(thread.id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser,
        }
      });

    await firebase.firestore()
      .collection('THREADS')
      .doc(thread.id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const messagesListener = firebase.firestore()
      .collection('THREADS')
      .doc(thread.id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#ff8c00'
          },
          left: {
            backgroundColor: '#ffffff'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#ff8c00' />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={35} color='#ff8c00' />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#ff8c00' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (
  <View style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.text}>
        {thread.name}
      </Text>
    </View>
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{ _id: firebase.auth().currentUser.uid }}
      placeholder='Type your message here...'
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    />
   </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  container: {
      height: 60,
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderColor: '#dcdcdc',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      flex: 1,
      width: '85%',
      color: '#ff7f50',
      fontFamily: 'notoserif',
      fontSize: 24,
      textAlign: 'center',
      paddingLeft: 0,
    },
    icon: {
    },
});