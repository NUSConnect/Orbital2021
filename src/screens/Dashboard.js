import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons, FontAwesome5 } from 'react-native-vector-icons';
import {
  HomeScreen,
  ForumScreen,
  FriendsScreen,
  ProfileScreen
} from './'

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#aaf0d1"
      labelStyle={{ fontSize: 12 }}
      barStyle={{ backgroundColor: '#00203f' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={28}
            style={{marginTop: -2, marginRight:1, width: 28}} />
          ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          tabBarLabel: 'Forum',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="forum" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-friends" color={color} size={24} style={{width: 34}} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" color={color} size={24} solid />
          ),
        }}
    />
    </Tab.Navigator>
  );
}

export default function Dashboard() {
    return (
        <MyTabs />
    );
}