import * as React from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  ProfilePersonalScreen,
  ProfileForumScreen,
  ProfileCommentsScreen
} from './'

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <SafeAreaView style={styles.safe}>
    <Tab.Navigator>
      <Tab.Screen name="Personal" component={ProfilePersonalScreen} />
      <Tab.Screen name="Posts" component={ProfileForumScreen} />
      <Tab.Screen name="Comments" component={ProfileCommentsScreen} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function ProfileScreen() {
  return (
    <MyTabs />
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:1,
    marginTop: StatusBar.currentHeight || 0,
  },
})
