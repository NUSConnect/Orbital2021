import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import MessageTopTab from '../../components/MessageTopTab';
import * as firebase from 'firebase';
import {
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../styles/MessageStyles';

export default function MessagesScreen({ navigation }) {

  const currentUserId = firebase.auth().currentUser.uid;
  var currentUserCreatedAt;
  const [threads, setThreads] = useState([]);

  useEffect(() => {
      getThreads();
  }, []);


  const getUserInfo = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(currentUserId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
            const { createdAt } = documentSnapshot.data();
            currentUserCreatedAt = createdAt;
        }
    });
  };

  const getThreads = async () => {
    // Get curr user info
    await firebase.firestore()
        .collection('users')
        .doc(currentUserId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
              const { createdAt } = documentSnapshot.data();
              currentUserCreatedAt = createdAt;
          }
    });

    // Get thread info
    const friendsArr = [];
    await firebase.firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          if (doc.id !== currentUserId) {
            const {
              name,
              createdAt,
              userImg,
            } = doc.data();

            var threadID;
            if (currentUserCreatedAt <= createdAt) {
                threadID = currentUserId + doc.id;
            } else {
                threadID = doc.id + currentUserId;
            }

            console.log('ThreadID: ', threadID);
            friendsArr.push({
              id: threadID,
              name,
              createdAt,
              userImg,
            })

          }
      })
    })
    console.log(friendsArr);
    setThreads(friendsArr);
  }
  return (
    <View style={styles.container}>
    <MessageTopTab onPress={() => navigation.goBack()} />
      <FlatList
        data={threads}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('ChatScreen', {thread: item})}>
                      <UserInfo>
                        <UserImgWrapper>
                          <UserImg source={{uri:item.userImg}} />
                        </UserImgWrapper>
                        <TextSection>
                          <UserInfoText>
                            <UserName>{item.name}</UserName>
                          </UserInfoText>
                        </TextSection>
                      </UserInfo>
                    </Card>
                  )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  },
  header: {
    fontSize: 35,
    textAlign: 'right',
    backgroundColor: '#ff8c00',
    padding: 10,
    color: '#ffffff'
  },
});