import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import SearchBar from '../../components/SearchBar';
import * as firebase from 'firebase';

export default function FriendsScreen(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }

    const ItemView = ({ item }) => {
        return (
          <Text style={styles.itemStyle} onPress={() => getItem(item)}>
            {item.id}
            {'.'}
            {item.title.toUpperCase()}
          </Text>
        );
      };

      const ItemSeparatorView = () => {
        return (
          <View
            style={{
              height: 0.5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
      };

    return (
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
        <View>
            <TextInput
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)} />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                  <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
            />
        </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  flatListWindow: {
  //done via trial and error, check
    paddingBottom:140,
  },
});