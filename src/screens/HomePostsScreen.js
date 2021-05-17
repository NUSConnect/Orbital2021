import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import MainPostScreen from './MainPostScreen';
//import CreatePost from '../components/CreatePost';
import Button from '../components/Button';
import Posts from '../data/Posts';

const DATA = Posts();

const Post = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Stack = createStackNavigator();

const HomePostsScreen = ({navigation}) => {
  const [isFetching, setIsFetching ] = useState(false);

  const renderItem = ({ item }) => (
//    setIsFetching(false),
    <Post title={item.title} />
  );

    function onRefresh() {
      () => renderItem(DATA);
//        {setIsFetching(true), () => {renderItem(DATA);}}
//        useEffect(setIsFetching(true), () => {renderItem(DATA);});
    }
  return (
    <SafeAreaView style={styles.container}>
      <Button
        mode='contained'
        onPress={() => navigation.navigate('MainPostScreen')}
      >
        Say something...
      </Button>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={() => onRefresh()}
        refreshing={isFetching}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000'
  },
});

export default HomePostsScreen;

//        refreshControl={<RefreshControl
//                        colors={['#9Bd35A', '#689F39']}
//                        refreshing={this.props.refreshing}
//                        onRefresh={this._onRefresh.bind(this)} />}