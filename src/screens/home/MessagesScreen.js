import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';
import * as firebase from 'firebase';

export default function MessagesScreen({ navigation }) {

  const currentUserId = firebase.auth().currentUser.uid;
  const [threads, setThreads] = useState([]);

  useEffect(() => {
              const subscriber = firebase.firestore()
                .collection('users')
                .onSnapshot(querySnapshot => {
                  const friendsArr = [];
                  querySnapshot.forEach(documentSnapshot => {
                  if (documentSnapshot.id !== currentUserId) {
                      friendsArr.push(documentSnapshot.data());
                  }
                  });
                  console.log(friendsArr)
                  setThreads(friendsArr);
                });
              return () => subscriber();
            }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
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