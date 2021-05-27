import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';
import * as firebase from 'firebase';

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
            })

          }
      })
    })
    console.log(friendsArr);
    setThreads(friendsArr);
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatScreen', { thread: item })}
          >
            <List.Item
              title={item.name}

              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});