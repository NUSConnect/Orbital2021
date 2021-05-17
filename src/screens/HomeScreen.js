import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import HomePostsScreen from './HomePostsScreen';
import MainPostScreen from './MainPostScreen';

const Stack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName="HomePostsScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="HomePostsScreen"
          component={HomePostsScreen}
        />
        <Stack.Screen name="MainPostScreen" component={MainPostScreen} />
      </Stack.Navigator>
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

export default HomeScreen;

//        refreshControl={<RefreshControl
//                        colors={['#9Bd35A', '#689F39']}
//                        refreshing={this.props.refreshing}
//                        onRefresh={this._onRefresh.bind(this)} />}