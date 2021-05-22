import * as React from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  ProfileMasterScreen,
  ProfilePostsScreen,
  ProfileCommentsScreen
} from './'

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <SafeAreaView style={styles.safe}>
      <Tab.Navigator
        tabBarOptions= {{
        pressColor: '#ffa500',
        pressOpacity: 'ffa500',
        indicatorStyle: { backgroundColor: '#ff8c00' },
        labelStyle: { fontSize: 14 }
      }}>
        <Tab.Screen name="Personal" component={ProfileMasterScreen} />
        <Tab.Screen name="Posts" component={ProfilePostsScreen} />
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
