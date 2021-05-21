import * as React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons, FontAwesome5 } from 'react-native-vector-icons';
import firebase from 'firebase/app'
import 'firebase/auth'
import { theme } from './src/core/theme'
import {
  AuthLoadingScreen,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard
} from './src/screens'
import { FIREBASE_CONFIG } from './src/core/config'

// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const Stack = createStackNavigator()
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AuthLoadingScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="AuthLoadingScreen"
            component={AuthLoadingScreen}
          />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
