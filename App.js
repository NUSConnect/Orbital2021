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
  Dashboard,
  OnBoardScreen
} from './src/screens'
import { FIREBASE_CONFIG } from './src/core/config'
import checkIfFirstLaunch from './src/api/firstLaunch'

const Stack = createStackNavigator();
const firstStack = createStackNavigator();
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null)

    React.useEffect(() => {
        checkIfFirstLaunch().then((isFirstLaunch) => {
            setIsFirstLaunch(isFirstLaunch)
        });
    }, [])

    if (isFirstLaunch === null) return null

  return (
      isFirstLaunch
      ? (<Provider theme={theme}>
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
      </Provider>)
      : (<Provider theme={theme}>
           <NavigationContainer>
           <firstStack.Navigator
              initialRouteName="OnBoardScreen"
              screenOptions={{
               headerShown: false,
              }}
           >
             <firstStack.Screen
                name="OnBoardScreen"
                component={OnBoardScreen}
             />
             <firstStack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
             <firstStack.Screen name="StartScreen" component={StartScreen} />
             <firstStack.Screen name="LoginScreen" component={LoginScreen} />
             <firstStack.Screen name="RegisterScreen" component={RegisterScreen} />
             <firstStack.Screen name="Dashboard" component={Dashboard} />
             <firstStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
             </firstStack.Navigator>
           </NavigationContainer>
         </Provider>)
  );
}
