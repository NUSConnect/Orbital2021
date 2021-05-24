import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar,ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as firebase from 'firebase';

export default function FriendsScreen() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
      const subscriber = firebase.firestore()
        .collection('users')
        .onSnapshot(querySnapshot => {
          const users = [];

          querySnapshot.forEach(documentSnapshot => {
          console.log(documentSnapshot.data().name);
          users.push(documentSnapshot.data().name)
          });
          console.log(users)
          setMasterDataSource(users);
          setLoading(false);
        });
      return () => subscriber();
    }, []);

    if (loading) {
      return <ActivityIndicator />;
    }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };


  const ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item}
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

  const getItem = (item) => {
    //action when item is clicked, leave as alert for now
    alert('Name: ' + item);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <View style={styles.container}>
        <SearchBar
        placeholder="Type Here..."
        onChangeText={(text) => searchFilterFunction(text)}
                  value={search}
                  underlineColorAndroid="transparent"
        /*
          inputStyle={{backgroundColor: 'black'}}
          inputContainerStyle={{backgroundColor: 'white'}}
          containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          value={search}
          inputStyle={{height:40}}
          */
        />

        <View style={styles.flatListWindow}>
            <FlatList
                data={masterDataSource}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
            />
        </View>

      </View>
    </SafeAreaView>
  );
};

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