import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import FindGroupScreen from './FindGroupScreen'
import MatchMeScreen from './MatchMeScreen'
import WaitingScreen from './WaitingScreen'

const Stack = createStackNavigator()

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName='FindGroupScreen'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='FindGroupScreen' component={FindGroupScreen} />
        <Stack.Screen name='MatchMeScreen' component={MatchMeScreen} />
        <Stack.Screen name='WaitingScreen' component={WaitingScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  }
})

export default HomeScreen
