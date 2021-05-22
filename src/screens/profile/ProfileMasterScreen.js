import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfilePersonalScreen from './ProfilePersonalScreen';
import AccountSettingsScreen from './AccountSettingsScreen';
import DummyScreen from './DummyScreen';

const Stack = createStackNavigator();

const ProfileMasterScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName="ProfilePersonalScreen"
        screenOptions={{
          headerShown: false,
         }}
      >
        <Stack.Screen
          name="ProfilePersonalScreen"
          component={ProfilePersonalScreen}
        />
        <Stack.Screen name="AccountSettingsScreen" component={AccountSettingsScreen} />
        <Stack.Screen name="DummyScreen" component={DummyScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default ProfileMasterScreen;