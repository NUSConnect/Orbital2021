import * as React from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import SearchBar from '../components/SearchBar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  ForumFavouritesScreen,
  ForumSubscribedScreen,
  ForumOthersScreen
} from './'

const TopTab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Favourites" component={ForumFavouritesScreen} />
      <TopTab.Screen name="Subscribed" component={ForumSubscribedScreen} />
      <TopTab.Screen name="Others" component={ForumOthersScreen} />
    </TopTab.Navigator>

  );
}

export default function ForumScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <SearchBar />
        <MyTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});